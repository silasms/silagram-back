package main

import (
	"context"
	// "encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	// "go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Estrutura de uma sala de chat
type Room struct {
	name     string
	clients  map[*Client]bool
	broadcast chan []byte
	register  chan *Client
	unregister chan *Client
}

// Estrutura de um cliente conectado
type Client struct {
	username	string
	socket		*websocket.Conn
	send			chan []byte
	room			*Room
	// mongo			*mongo.Database
}

// Estrutura que gerencia as salas
type Hub struct {
	rooms map[string]*Room
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Função para criar uma nova sala
func newRoom(name string) *Room {
	return &Room{
		name:      name,
		clients:   make(map[*Client]bool),
		broadcast: make(chan []byte),
		register:  make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Função para criar o Hub de gerenciamento das salas
func newHub() *Hub {
	return &Hub{
		rooms: make(map[string]*Room),
	}
}

// Função que gerencia uma sala
func (room *Room) runRoom() {
	for {
		select {
		case client := <-room.register:
			room.clients[client] = true
		case client := <-room.unregister:
			if _, ok := room.clients[client]; ok {
				delete(room.clients, client)
				close(client.send)
			}
		case message := <-room.broadcast:
			for client := range room.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(room.clients, client)
				}
			}
		}
	}
}

// Função para gerenciar as salas no Hub
func (hub *Hub) getRoom(roomName string) *Room {
	if room, ok := hub.rooms[roomName]; ok {
		return room
	}
	room := newRoom(roomName)
	hub.rooms[roomName] = room
	go room.runRoom()
	return room
}

// Função para gerenciar um cliente (conexão websocket)
func (client *Client) readMessages() {
	defer func() {
		client.room.unregister <- client
		client.socket.Close()
	}()
	for {
		_, message, err := client.socket.ReadMessage()
		if err != nil {
			break
		}
		client.room.broadcast <- message
	}
}

// Função para escrever mensagens para um cliente
func (client *Client) writeMessages() {
	defer func() {
		client.socket.Close()
	}()

	// chatCollection := client.mongo.Collection("chats")
	
	for {
		select {
		case message, ok := <-client.send:
			if !ok {
				client.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			client.socket.WriteMessage(websocket.TextMessage, message)
			// var room bson.M
			// err := chatCollection.FindOne(context.TODO(), bson.D{{"id", client.room}}).Decode(&room)
			// if err == mongo.ErrNoDocuments {
			// 	fmt.Printf("No chat was found with the title %s\n", client.room)
			// 	return
			// }
		}
	}
}

// Função para lidar com uma nova conexão WebSocket
func serveWs(hub *Hub, mongo *mongo.Database, w http.ResponseWriter, r *http.Request) {
	roomName := r.URL.Query().Get("room")
	username := r.URL.Query().Get("username")

	if roomName == "" {
		http.Error(w, "Room name is required", http.StatusBadRequest)
		return
	}

	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erro ao atualizar para websocket:", err)
		return
	}

	room := hub.getRoom(roomName)
	client := &Client{socket: socket, room: room, send: make(chan []byte), username: username}
	room.register <- client

	go client.readMessages()
	go client.writeMessages()
}

func main() {
	err := godotenv.Load()
  if err != nil {
    log.Fatal("Error loading .env file")
  }
	uri := os.Getenv("GO_DATABASE_URL")
	hub := newHub()

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Error to connection mongo")
	}

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	coll := client.Database("mydb")
	// username := "silas1"
	// var result bson.M
	// err = coll.Collection("users").FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&result)
	// if err == mongo.ErrNoDocuments {
	// 	fmt.Printf("No document was found with the title %s\n", username)
	// 	return
	// }
	// jsonData, err := json.MarshalIndent(result, "", "    ")
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Printf("%s\n", jsonData)


	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, coll, w, r)
	})

	fmt.Println("Servidor iniciado na porta :8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Erro ao iniciar servidor:", err)
	}
}
