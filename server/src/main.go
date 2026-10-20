package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	// Pages
	server.GET("/", func(ctx *gin.Context) {
		ctx.File("../../client/src/pages/index.html")
	})
	server.GET("/quiz", func(ctx *gin.Context) {
		ctx.File("../../client/src/pages/quiz.html")
	})
	server.GET("/quiz/play", func(ctx *gin.Context){
		ctx.File("../../client/src/pages/play.html")
	})

	server.Static("/styles", "../../client/src/styles")
	server.Static("/scripts", "../../client/src/scripts")

	server.Run(":8080")
}
