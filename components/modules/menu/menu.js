renderer.selectComponent('Menu')
  .onEnter(function() {
    this.el.addEventListener(`click:${this.id}`, null, ev => {
      if (ev.target.componentName === 'ListItem') {
        this.setState({ activeItem: ev.target.attrs['data-id'] });
      }
    });
  })
  .onExit(function(dom) { 
    this.el.removeEventListener(`click:${this.id}`);
  });