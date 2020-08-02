package models

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CreatedAt int64  `json:"createdAt"`
}

type UserFull struct {
	ID        primitive.ObjectID `bson:"_id"`
	Name      string             `json:"name"`
	Email     string             `json:"email"`
	Password  string             `json:"password"`
	CreatedAt int64              `json:"createdAt"`
}

type UserResponse struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt int64  `json:"createdAt"`
}

func (user *User) SetCreatedAt() {
	user.CreatedAt = time.Now().Unix()
}

func (user *User) Encrypt(password string) {
	hash, bcryptErr := bcrypt.GenerateFromPassword([]byte(password), 12)
	if bcryptErr != nil {
		log.Fatal(bcryptErr)
	}

	user.Password = string(hash)
}

func (user *User) GetSignedJWT(id string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)

	claims["id"] = id
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	return tokenString, nil
}
