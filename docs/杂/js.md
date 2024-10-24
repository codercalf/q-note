由于arguments有iterator接口
```
function test() {
  return arguments
}
let [...arr] = test()
// arr: []
```
