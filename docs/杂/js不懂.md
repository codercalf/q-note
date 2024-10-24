```
;(function () {
  var b = 0
  console.log('---->1', b) // 0
  if (1) {
    console.log('---->2', b) // f
    b = 3
    console.log('---->3', b) // 3
    function b() {}
    console.log('---->4', b) // 3
    b = 4
    console.log('函数里面的b', b) //4
  }
  console.log(b) //3
})()
```

