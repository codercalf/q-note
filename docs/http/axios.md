asios，发送对象数据。

原理

对象转json，

xhr请求头content-type设置为application/json，

```
// 和下面代码一致
let xhr = new XMLHttpRequest()

let data = {
  test: 'echo'
}
let param = JSON.stringify(data)

xhr.open('POST', 'http://127.0.0.1:8888')
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onreadystatechange = function(){
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.send(param)

```

