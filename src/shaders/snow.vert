uniform vec3 uCamPos;
uniform vec3 uPosition;
varying vec4 vVertexColor;
varying vec3 vNormal;

void main(){
  vec3 N = normalize(normalMatrix * normal);// 頂点
  vec3 C = normalize(uCamPos);
  // 視線ベクトルの反射
  float a = dot(C, normal);
  // グロー補完
  float alpha = pow(a, 5.0);
  vVertexColor = vec4(1.0, 1.0, 1.0, alpha);

  // instaceMatrixから受け取った位置に配置
  vec4 instancePosition = instanceMatrix * vec4(position,1.);
  gl_Position=projectionMatrix*modelViewMatrix*instancePosition;
}