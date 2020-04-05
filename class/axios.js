class Axios {
  constructor(url) {
    this.url = url

  }
  getAxios() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", this.url, true) // true 表示异步
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          let data = JSON.parse(xhr.responseText).users
          resolve(data)
        }
      }
      xhr.send(null)
    })
  }
}