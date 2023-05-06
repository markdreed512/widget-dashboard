const todoApp = angular.module('todoApp', [])

todoApp.controller("todoController", ['$scope', function($scope){
    $scope.todo = ""
    $scope.todos = []
    $scope.addTodo = function(){
        $scope.todos.push({
            todoLabel: $scope.todo, 
            complete: false, id: Date.now() + Math.random(), 
            editMode: false
        })
        $scope.todo = ""
    }
    $scope.clearCompleted = function(){
       $scope.todos =  $scope.todos.filter((todo) => {
            return !todo.complete
        })
    }
    $scope.deleteTodo = function(){
        $scope.todos =  $scope.todos.filter((todo) => {
            return todo.id !== this.todo.id
        })
    }
    $scope.editTodo = function(){
        console.log(this.todo)
        // this.editMode = !this.todo.editMode
        let updatedEditMode = !this.todo.editMode
        $scope.todos =  $scope.todos.map((todo) => {
            return todo.id === this.todo.id ? {todoLabel: todo.todoLabel, complete: todo.complete, id: todo.id, editMode: !todo.editMode } : todo
        })
    }
}])
 
todoApp.controller("alarmController", ['$scope', function($scope){
    $scope.time = ""
    $scope.alarms = []
    $scope.times = ["8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","9:29 PM"]
    $scope.soundAlarm = function(id){
        console.log("sounding alarm for...", id)
    }
    $scope.addAlarm = function(){
        let timeArr = $scope.time.split(":")
        let isPm = timeArr[1].split(' ')[1] === "PM"
        let hour = isPm && +timeArr[0] !== 12 ? +timeArr[0] + 12 : +timeArr[0]
        let minute = +timeArr[1].split(' ')[0]
        let alarmTime = dayjs().set('hour', hour).set('minute', minute)
        let id = Date.now() + Math.random()
        $scope.alarms.push({
            displayTime: $scope.time,
            alarmTime: alarmTime,
            id: id
        })
        let timer = setInterval(function(){
            if(alarmTime.$H === dayjs().get('hour') && alarmTime.$m === dayjs().get('minute')){
                $scope.soundAlarm(id)
                clearInterval(timer)
            }
        }, 1000)
    }

}])
