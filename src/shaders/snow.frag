varying vec4 vVertexColor;

void main(){
  // 透明度もグロー補完の一部として考慮されます。
  gl_FragColor = vVertexColor;// 白、または任意の色に設定
}