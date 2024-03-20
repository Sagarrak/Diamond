export const createImageFromInitials = (size, firstName="",lastName="",color) => {
    let name= `${firstName && firstName[0]?.toUpperCase()||""}${lastName && lastName[0]?.toUpperCase()||""}`
    const canvas=document.createElement('canvas')
    const context=canvas.getContext('2d')
    canvas.width=canvas.height=size
  
    context.fillStyle="#ffffff"
    context.fillRect(0,0,size,size)
  
    context.fillStyle=`#7367f030`
    context.fillRect(0,0,size,size)
  
    context.fillStyle=`#7367f0`;
    context.textBaseline='middle'
    context.textAlign='center'
    context.fontWeight='700'
    context.font =`${size/2.3}px Georgia`
    context.fillText(name,(size/2),(size/2))
  
    return canvas.toDataURL()
  };
  
  
  export const  getRandomColor=()=> {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }