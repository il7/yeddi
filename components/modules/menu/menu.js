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
  })


// {
//   componentName: 'Menu',
//   type: 'tag',
//   name: 'ul',
//   attrs: {
//     class: 'menu',
//     items: [{
//       title: 'Numbers',
//       href: '/numbers/'
//     }, {
//       title: 'Letters',
//       href: '/letters/'
//     }]
//   },
//   children: [{
//     componentName: 'MenuItem',
//     type: 'tag',
//     name: 'li',
//     children: [{
//       type: 'tag',
//       name: 'a',
//       attrs: {
//         href: '/numbers'
//       },
//       children: 'Numbers'
//     }, {
//       type: 'tag',
//       name: 'a',
//       attrs: {
//         href: '/letters'
//       },
//       children: 'Letters'
//     }]
//   }]
// }