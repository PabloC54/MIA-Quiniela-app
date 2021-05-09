package main

func main() {
	a := App{}
	a.Start()

	PORT := "8000"
	a.Run(PORT)
}
