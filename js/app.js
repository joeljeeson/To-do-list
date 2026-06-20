angular.module('taskManagerApp', [])

.directive('focusOnEdit', ['$timeout', function($timeout){
  return {
    restrict: 'A',
    link: function(scope, element){
      $timeout(function(){
        element[0].focus();
        element[0].select();
      }, 0);
    }
  };
}])

.controller('TaskController', ['$scope', function($scope){
  var vm = this;

  vm.today = new Date();

  var idCounter = 5;
  vm.tasks = [
    {id:1, text:'Write project proposal', priority:'high', done:false, createdAt:new Date('2026-06-17')},
    {id:2, text:'Review pull requests', priority:'medium', done:false, createdAt:new Date('2026-06-18')},
    {id:3, text:'Update dependencies', priority:'low', done:true, createdAt:new Date('2026-06-15')},
    {id:4, text:'Schedule team sync', priority:'medium', done:true, createdAt:new Date('2026-06-16')}
  ];

  /* ---------------- add ---------------- */
  vm.newTaskText = '';
  vm.newTaskPriority = 'medium';

  vm.addTask = function(){
    var text = (vm.newTaskText || '').trim();
    if(!text) return;
    vm.tasks.unshift({
      id: idCounter++,
      text: text,
      priority: vm.newTaskPriority || 'medium',
      done: false,
      createdAt: new Date()
    });
    vm.newTaskText = '';
    vm.newTaskPriority = 'medium';
  };

  /* ---------------- toggle / delete ---------------- */
  vm.toggleTask = function(t){
    t.done = !t.done;
  };

  vm.removeTask = function(t){
    vm.tasks = vm.tasks.filter(function(item){ return item.id !== t.id; });
    if(vm.editingId === t.id) vm.cancelEdit();
  };

  vm.clearCompleted = function(){
    vm.tasks = vm.tasks.filter(function(item){ return !item.done; });
  };

  /* ---------------- edit ---------------- */
  vm.editingId = null;
  vm.editText = '';
  vm.editPriority = 'medium';

  vm.startEdit = function(t){
    vm.editingId = t.id;
    vm.editText = t.text;
    vm.editPriority = t.priority;
  };

  vm.saveEdit = function(t){
    var text = (vm.editText || '').trim();
    if(!text) return;
    t.text = text;
    t.priority = vm.editPriority;
    vm.cancelEdit();
  };

  vm.cancelEdit = function(){
    vm.editingId = null;
    vm.editText = '';
    vm.editPriority = 'medium';
  };

  /* ---------------- filter / sort ---------------- */
  vm.filters = [
    {id:'all', label:'All'},
    {id:'pending', label:'Pending'},
    {id:'completed', label:'Completed'}
  ];
  vm.activeFilter = 'all';
  vm.sortBy = 'newest';

  vm.setFilter = function(id){ vm.activeFilter = id; };

  vm.countFor = function(filterId){
    if(filterId === 'pending') return vm.pendingCount();
    if(filterId === 'completed') return vm.completedCount();
    return vm.tasks.length;
  };

  vm.pendingCount = function(){
    return vm.tasks.filter(function(t){ return !t.done; }).length;
  };
  vm.completedCount = function(){
    return vm.tasks.filter(function(t){ return t.done; }).length;
  };

  var priorityRank = {high:0, medium:1, low:2};

  vm.filteredTasks = function(){
    var list = vm.tasks;
    if(vm.activeFilter === 'pending') list = list.filter(function(t){ return !t.done; });
    if(vm.activeFilter === 'completed') list = list.filter(function(t){ return t.done; });

    list = list.slice();
    if(vm.sortBy === 'newest'){
      list.sort(function(a,b){ return b.createdAt - a.createdAt; });
    } else if(vm.sortBy === 'oldest'){
      list.sort(function(a,b){ return a.createdAt - b.createdAt; });
    } else if(vm.sortBy === 'priority'){
      list.sort(function(a,b){ return priorityRank[a.priority] - priorityRank[b.priority]; });
    }
    return list;
  };

  vm.emptyMessage = function(){
    if(vm.tasks.length === 0) return 'No tasks yet.';
    if(vm.activeFilter === 'pending') return 'Nothing pending — you\'re all caught up!';
    if(vm.activeFilter === 'completed') return 'No completed tasks yet.';
    return 'No tasks here.';
  };

}]);
