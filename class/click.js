class Tab {
  constructor({
    list,
    tab,
    button
  }) {
    console.log();
    list = this.list = document.querySelector(`.${list}`)
    tab = this.tab = Array.from(document.querySelectorAll(`.${tab}`))
    button = this.button = Array.from(document.querySelectorAll(`.${button}`))
    this.bindEvent()
    this.select(0)
  }
  bindEvent() {
    this.tab.forEach((item, index) => {
      item.addEventListener("click", () => {
        this.select(index)
      })
    })
  }
  select(current) {
    this.tab.forEach((item, index) => {
      if (index === current) {
        item.style.color = 'red'
        this.button[index].style.display = 'block'
      } else {
        item.style.color = '#000'
        this.button[index].style.display = 'none'
      }
    })
  }
}

let name = 'sunseekers'