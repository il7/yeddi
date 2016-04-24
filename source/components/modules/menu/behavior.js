export default function MenuBehavior(node) {
  node.selectComponents('Menu')
    .enter(function() {
      this.el.addEventListener(`click:${this.id}`, null, ev => {
        if (ev.target.componentName === 'ListItem') {
          this.setState({ activeItem: ev.target.attrs['data-id'] });
        }
      });
    })
    .exit(function(dom) { 
      this.el.removeEventListener(`click:${this.id}`);
    });  
}
