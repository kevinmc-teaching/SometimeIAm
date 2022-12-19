

const colors = ['hotpink', 'hsl(240, 60%, 70%)', 'orangered', 'hsl(300, 20%, 70%)','maroon', 'teal','olive','hsl(30,60%,60%)', 'fuschia', 'hsl(300,20%,50%)'];
const root = document.querySelector(':root');
const rn = Math.floor(Math.random() * colors.length); 
console.log(rn);

root.style.setProperty('--accentColor', colors[rn]);
