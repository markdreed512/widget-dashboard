const todoApp = angular.module('todoApp', [])

todoApp.controller("todoController", ['$scope', function($scope){
    $scope.todo = ""
    $scope.todos = localStorage.getItem('todos')? localStorage.getItem('todos') : []
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
        let updatedEditMode = !this.todo.editMode
        $scope.todos =  $scope.todos.map((todo) => {
            return todo.id === this.todo.id ? {todoLabel: todo.todoLabel, complete: todo.complete, id: todo.id, editMode: !todo.editMode } : todo
        })
    }
}])
 
todoApp.controller("alarmController", ['$scope', '$interval', function($scope, $interval){
    $scope.label = ""
    $scope.time = ""
    $scope.alarms = JSON.parse(localStorage.getItem('alarms')) || []
    console.log('$scope.alarms: ', $scope.alarms)
    $scope.times = ["8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","10:10 AM"]
    $scope.deactivateAlarm = function(){
        this.alarm.active = false
        this.alarm.on = false
    }
    $scope.soundAlarm = function(id){
        $scope.alarms = $scope.alarms.map(alarm => {
            return alarm.id === id ? {
                displayTime: alarm.displayTime,
                alarmTime: alarm.alarmTime,
                id: alarm.id,
                active: alarm.active,
                on: true
            } : alarm
        })
        let myInterval = setInterval(function(){
            let thisAlarm = $scope.alarms.filter(alarm => {
                return alarm.id === id
            })[0]
            if (thisAlarm.active){
                document.getElementById('alarmAudio').play()
            }else{
                alarm.on = false
                clearInterval(myInterval)
            }
        },2000)
    }
    $scope.addAlarm = function(){
        let timeArr = $scope.time.split(":")
        let isPm = timeArr[1].split(' ')[1] === "PM"
        let hour = isPm && +timeArr[0] !== 12 ? +timeArr[0] + 12 : +timeArr[0]
        let minute = +timeArr[1].split(' ')[0]
        let alarmTime = dayjs().set('hour', hour ).set('minute', minute )
        let id = Date.now() + Math.random()
        $scope.alarms.push({
            displayTime: $scope.time,
            alarmTime: alarmTime,
            id: id,
            active: true,
            on: false,
            labelMode: false,
            label: $scope.label
        })
        localStorage.setItem('alarms', JSON.stringify($scope.alarms))
        let timer = $interval(function(){
            if(alarmTime.$H === dayjs().get('hour') && alarmTime.$m === dayjs().get('minute')){
                console.log("Time for alarm")
                $scope.soundAlarm(id)
                $interval.cancel(timer)
            }
        }, 1000)
    }
    $scope.removeAlarm = function(){
        console.log(this)
        $scope.alarms = $scope.alarms.filter(alarm => {
            return alarm.id !== this.alarm.id
        })
        localStorage.setItem('alarms', JSON.stringify($scope.alarms))
    }
    $scope.toggleLabelInput = function(){
        console.log("this:", this)
        this.alarm.labelMode = !this.alarm.labelMode
        if(this.alarm.labelMode){
            this.alarm.label = $scope.label
        }
        localStorage.setItem('alarms', JSON.stringify($scope.alarms))
    }
}])
