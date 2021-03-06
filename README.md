# Usaginity

Records web page activity.

## Installation
It is compiled using browserify. The main file is main.js.

## API

### new Usaginity([options]) or Usaginity([options])
It cannot be instantiated directly but the main global Usaginity returns an instance of the library through singleton pattern.

Through this instance it is possible to track events, transitions and create timers along the page lifelong.
Moreover every action is queued and executed/dispatched asynchronously. Every action might create an *Interaction* object which will store the tracked information and it will store it automatically into a local cache. When it is needed, the persistence layer will sent cached *Interaction* objects to server.

#### Options

  * **persistence** object

    Optional configuration object for the persistence layer.
    
    * **instantly** boolean
    
      Sets if after creating a new *Interaction* object the cache should be flushed (after every action, the new *Interaction* will be sent to server).
    
    * **buffer** int
      
      Sets the buffer size for the Interaction cache. If it is full, then the cache will be flush to server. If the *instantly* property is set as true, then this property does not have any effect.
    
    * **bfTimeout** long
    
      Amount of time that and Interaction will remain in the cache before send it to server. If the *instantly* property is set as true, then this property does not have any effect.
    
    * **windowSize** int
    
      By default the value is *Infinity*. It is the cache flushing window size which is the amount of Interaction objects in cache that will be sent at once to server.

The following properties and methods are available on a *Usaginity* instance:

* **entering()**

	Defines when to start tracking. It will detect automatically when to stop tracking which will be when user is going to close the web.

  ```javascript
  ug.entering();
  ```
* **event(eventType, nameId, [label])**

	Creates an Interaction event. The *eventType*, which defines the event type (e.g. *click*), *nameId*, which defines the Id to group this event, and the *label* var, which can be used to specify more information about the tracked element, are appended into the created Interaction object.
    
  ```javascript
  ug.event('click', 'linksList', 'label');
  ```

* **transition()**

	Defines a transition between two URL. It is useful when in sigle-page application.
    
  ```javascript
  ug.transition();
  ```

* **startTimer(timerId)**

	Defines an internal timer. The var *timerId* is used to identify the timer.
    
  ```javascript
  ug.startTimer('sectionIdLoadTime');
  ```

* **endTimer(timerId)**

	Defines when to stop a previously executed timer. If leaving the page, this will be executed automatically.
    
  ```javascript
  ug.endTimer('sectionIdLoadTime');
  ```
  
### new Interaction(type)
Defines a tracked page interaction. Depending of the *type* it will store some properties that are common but also other that are personalized.

The following properties and methods are available on a *Interaction* instance:

* **type** string

	Specifies the Interaction type which can be:

  * *entering*

    Defines when user has entered to the page.
  
  * *leaving*

    Defines when user has left the page.

  * *timer*

    Defines a timer interaction.
  
  * *transition*
  
    Defines a page transition from one page to another.
  
* **date** long

  Specifies when the Interaction was tracked. In milliseconds.
  
* **referrer** string

  If possible, specifies from where the user comes from.
  
* **url** string

  The current URL.

* **title** string

  The current page title.

* **trackId** string

  An Id to track browser in current and future sessions

* **timerName** string

  In an *timer* type *Interaction* it will contain the set timerId.

* **tend** long

  In an *timer* and *transition* type *Interaction* it will contain when the timer was stopped. In milliseconds.

* **tdiff** long

  In an *timer* and *transition* type *Interaction* it will contain the elapsed time between *now* and *tend* timings. In milliseconds.

## Status

This library is just an experiment and should not be used in any production environment. The network layer is just a fake layer, but updating this part with a real server call it should work.