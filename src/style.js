"use strict"

const css = `
.rjs-react-nav-modal{z-index:3;display:none;padding-top:100px;position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4)}
.rjs-react-nav-modal-content{margin:auto;background-color:#fff;position:relative;padding:0;outline:0;width:600px}
.rjs-react-nav-card-4,.w3-hover-shadow:hover{box-shadow:0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19)}
`;

const animation = `
@keyframes rjs-react-nav-animate-slide-top {from{top:-300px;opacity:0} to{top:0;opacity:1}}
@keyframes rjs-react-nav-animate-slide-bottom {from{bottom:-300px;opacity:0} to{bottom:0;opacity:1}}
@keyframes rjs-react-nav-animate-fade-in { from{opacity:0;} to{opacity:1;}}
@keyframes rjs-react-nav-animate-fade-out { from{opacity:1;} to{opacity:0;}}
`;

export function appendStyle() {
  if (document.getElementById('__rjs-react-nav-style')) { return }
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('id', '__rjs-react-nav-style');
  style.appendChild(document.createTextNode(css));
  style.appendChild(document.createTextNode(animation));
  head.appendChild(style);
}
