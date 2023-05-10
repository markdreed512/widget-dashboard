const dashboard = angular.module('dashboard', [])

dashboard.controller("todoController", ['$scope', '$window', '$interval' , function($scope, $window, $interval){
    $scope.clock = ""
    $scope.todo = ""
    $scope.todos = $window.localStorage.getItem('todos')? JSON.parse($window.localStorage.getItem('todos')) : []
    $scope.updateTodosInLocalStorage = function(){
        $window.localStorage.setItem('todos', JSON.stringify($scope.todos))
    }
    $scope.addTodo = function(){
        $scope.todos.push({
            todoLabel: $scope.todo, 
            complete: false, id: Date.now() + Math.random(), 
            editMode: false
        })
        $scope.todo = ""
        $scope.updateTodosInLocalStorage()
    }
    
    $scope.clearCompleted = function(){
       $scope.todos =  $scope.todos.filter((todo) => {
            return !todo.complete
        })
        $scope.updateTodosInLocalStorage()
    }
    $scope.deleteTodo = function(){
        $scope.todos =  $scope.todos.filter((todo) => {
            return todo.id !== this.todo.id
        })
        $scope.updateTodosInLocalStorage()
    }
    $scope.editTodo = function(){
        let updatedEditMode = !this.todo.editMode
        $scope.todos =  $scope.todos.map((todo) => {
            return todo.id === this.todo.id ? {todoLabel: todo.todoLabel, complete: todo.complete, id: todo.id, editMode: !todo.editMode } : todo
        })
        $scope.updateTodosInLocalStorage()
    }
   
}])
 
dashboard.controller("alarmController", ['$scope', '$interval', '$window', '$http', function($scope, $interval, $window, $http){
    $scope.label = ""
    $scope.time = ""
    $scope.alarms = JSON.parse($window.localStorage.getItem('alarms')) || []
    console.log('$scope.alarms: ', $scope.alarms)
    $scope.times = ["8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","4:24 PM"]
    $interval(function(){
        let clock = new Date().toLocaleTimeString(); 
        $scope.clock = clock
    },1000)
    $scope.deactivateAlarm = function(){
        this.alarm.active = false
        this.alarm.on = false
    }
    $scope.soundAlarm = function(id){
        console.log("alarm sounding...")
        $scope.alarms = $scope.alarms.map(alarm => {
            return alarm.id === id ? {
                displayTime: alarm.displayTime,
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
    $scope.addAlarmToDb = function(alarm){
         $http.post('http://localhost:3000/alarm', JSON.stringify(alarm))
            .then(function successCallback(response){
                console.log("success! ", response)
            }, function errorCallback(response){
                console.log("error: " ,response)
            });
    }
    $scope.addAlarm = function(){
        let timeArr = $scope.time.split(":")
        let isPm = timeArr[1].split(' ')[1] === "PM"
        let hour = isPm && +timeArr[0] !== 12 ? +timeArr[0] + 12 : +timeArr[0]
        let minute = +timeArr[1].split(' ')[0]
        let id = Date.now() + Math.random()
        let newAlarm = {
            displayTime: $scope.time,
            id: id,
            active: true,
            on: false,
            labelMode: false,
            label: $scope.label
        }
        $scope.alarms.push(newAlarm)
        $scope.addAlarmToDb(newAlarm)
        $window.localStorage.setItem('alarms', JSON.stringify($scope.alarms))
        let timer = $interval(function(){
            let date = new Date()
            let currentHour = date.getHours()
            let currentMinute = date.getMinutes()
            if(hour == currentHour && minute == currentMinute){
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
        $window.localStorage.setItem('alarms', JSON.stringify($scope.alarms))
    }
    $scope.toggleLabelInput = function(){
        console.log("this:", this)
        this.alarm.labelMode = !this.alarm.labelMode
        if(this.alarm.labelMode){
            this.alarm.label = $scope.label
        }
        $window.localStorage.setItem('alarms', JSON.stringify($scope.alarms))
    }
}])
