(function () {
  const chat = angular.module('chat', ['ngMaterial']);

  chat.component('chatList', {
    templateUrl: '/static/webapp/chat/templates/chat-list.html',
    bindings: {
      newChat: '<'
    },
    controller: 'chatListController',
    controllerAs: '$ctrl',
  })

  chat.factory('Chat', Chat);
  chat.factory('simpleChat', simpleChat);

  Chat.$inject = ['$resource'];
  simpleChat.$inject = ['$resource'];

  function simpleChat ($resource) {
    let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'},
        delete: {method: 'DELETE'}
      }
      return $resource ('api/v1/simple-chat/:id/', cfg, action);
  }

  function Chat ($resource) {
    let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'},
        delete: {method: 'DELETE'}
      }
      return $resource ('api/v1/chat/:id/', cfg, action);
  }

  chat.controller('chatListController',function(dynamicEntries, simpleChat, $scope, Authentication) {
      this.user = Authentication.getAuthenticatedAccount().data
      this.chats = dynamicEntries(simpleChat.query, {involved_users__username: this.user.username});

      this.getOtherUser = function(users) {
        return users.filter((user) => {return self.currentUser.username !== user}).join(', ');
      }

      this.$onChanges = function(changes) {
        if (this.chats.allLoaded.length && changes.newChat) {
        let index =this.chats.allLoaded.findIndex((chat)=> {
          return chat.id === this.newChat.message.chatId
        });
        if (index > -1)
          this.chats.allLoaded[index].last_message = this.newChat.message;
          console.log(this.chats);
        }
      }

      this.search = function(term) {
        this.hasSearched = true;
        let cfg = {search: term, involved_users__username: this.user.username}
        this.chats = dynamicEntries(simpleChat.query, cfg);
      }

    })


  chat.controller('chatController', function chatController($scope, user, currentChat, $location, Chat,
    dynamicEntries, $mdSidenav, $mdMedia, $mdComponentRegistry) {
    this.currentUser = user;
    this.$mdMedia =$mdMedia;
    let self = this;
    self.inputText = ''


    if (currentChat === 'create') {
      self.otherUser = $location.hash();
      Chat.query({involved_users__username: [self.currentUser.username, $location.hash()]}).$promise.then((response => {
        if (response.length) {
          $location.url(`/chat/${response[0].id}/`).replace();
        }
      }))
    }
    else {
      Chat.get({id: currentChat}).$promise.then((response) => {
        self.messages =response.message;
        self.otherUser = response.involved_users.filter((user) => {return self.currentUser.username !== user}).join(', ');
        //self.otherUsers = response.involved_users.join(', ') if
        //for (let i = 0; i < response.involved_users.length; i++)
      }, (error) => {
        $location.url('notFound');
      })
    }

    const path = 'ws://' +window.location.host + `/ws/chat/${currentChat}/`;
    let chatSocket = new ReconnectingWebSocket(path);

    chatSocket.onopen = function(e) {
      //fetchMessages();
      $mdSidenav('right').open();
      $mdSidenav('left').close();
      self.updateChatList = true;
    }

    chatSocket.onmessage = function(e) {
      var data = JSON.parse(e.data);
      if (data['command'] === 'messages') {
        for (let i=0; i<data['messages'].length; i++) {
          createMessage(data['messages'][i]);
        }
      } else if (data['command'] === 'new_message'){
        createMessage(data);
      }

    };

    chatSocket.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').onkeyup = function(e) {
      if (e.keyCode === 13) {  // enter, return
          document.querySelector('#chat-send').click();
      }
    };

    $mdComponentRegistry.when('right').then(function() {
      $mdSidenav('right').onClose(function() {
          self.updateChatList = false;
        });
    })

    this.lockSidenav = function() {
      $mdSidenav('right').close();
    }

    this.toggleRight = function() {
      $mdSidenav('right').toggle();
      self.updateChatList = true;
    }

    this.sendWebsocketMessage = function(e) {
      if (currentChat === 'create') {
        Chat.post({involved_users:[self.currentUser.username, $location.hash()]}).$promise.then(response => {
          chatSocket.send(JSON.stringify({
            'command': 'new_message',
            'message': self.inputText,
            'from': self.currentUser.username,
            'chat': response.id,
            // 'to': $location.hash()
          }));
          $location.url(`/chat/${response.id}`);
        })
      }
      else {
        chatSocket.send(JSON.stringify({
          'command': 'new_message',
          'message': self.inputText,
          'from': self.currentUser.username,
          'chat': currentChat,
          // 'to': $location.hash()
        }));
      }
      self.inputText ='';
    };

    function fetchMessages() {
      chatSocket.send(JSON.stringify({'command': 'fetch_messages' }));
    }

    function createMessage(data) {
      self.messages.push(data.message);
      self.newChat = data;
      $scope.$apply();
    }
  })
})();