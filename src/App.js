
//http:www.peter-weinberg.com/files/1014/8073/6015/BeepSound.
import React from 'react';
import ReactDOM from 'react-dom'
import accurateInterval from 'accurate-interval';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.SECONDS = 60;
    this.MINUTES = 25;
    this.BREAK = 5;
    this.intervalID = null;
    this.alarm = null;
    this.state = {
      sessionLength: this.MINUTES,
      breakLength: this.BREAK,
      seconds: 0,
      minutes: this.MINUTES,
      break: false,
      pause: true
    }
  }
  playAudio = () => {
    let promisePlay;
    if(this.alarm !== null) {
      this.alarm.currentTime = 0;
      this.alarm.volume = 0.1;
    }
    promisePlay = this.alarm.play();
    if(promisePlay !== undefined) {
      promisePlay.then(_ => {
        console.log("playing...");
      }).catch(error => {
        console.log(error+" auto play was prevented");
      });
    }

  }
  pauseAudio = () => {
    if(this.alarm !== null) {
      let promisePause = this.alarm.pause();
      if(promisePause !== undefined) {
        promisePause.then(_ => {
          console.log("pausing...");
        }).catch(error => {
          console.log(error+" pause was prevented");
        });
      }
    }
  }
  session_BreakToggle = () => {
    if(!this.state.pause) {
      this.intervalID = accurateInterval( () => {
        if(this.state.minutes == 0 && this.state.seconds == 0) {
          console.log('zeros')
          this.toggle();
        }
          if(this.state.seconds == 0) {
              this.setState(
                {
                  minutes: this.state.minutes != 0? this.state.minutes - 1: (this.state.break? this.state.sessionLength: this.state.breakLength),
                  seconds: this.SECONDS
                }
              );
          }
        this.setState({seconds: this.state.seconds - 1});
        if(this.state.minutes == 0 && this.state.seconds == 0) this.playAudio();
      },1000);
    }
    else {
     this.intervalID && this.intervalID.clear(); //cancel
    }
  }

  startStopSession = () => {
    this.setState(
      {pause: !this.state.pause},
      () => {
         this.session_BreakToggle();
      }
    );
  }

  toggle = () => {
    console.log('toggle!')
    this.setState({
      seconds: 0,
      break: !this.state.break
    },() => {
      this.setState({minutes: this.state.break? this.state.breakLength: this.state.sessionLength});
    });
  }
    handleReset = () => {
    if(this.alarm !== null) {
      this.pauseAudio();
      this.alarm.currentTime = 0;
    }
    this.intervalID && this.intervalID.clear();  // cancel()
    this.setState({
      minutes: this.MINUTES,
      seconds: 0,
      sessionLength: this.MINUTES,
      breakLength: this.BREAK,
      break: false,
      pause: true
    });
    this.intervalID = null;
  }
  componentWillMount() {

  }
  render() {
    this.alarm = document.getElementById('beep');
    return(
    <div id='container'>
      <Alarm />
      <h1 id='main-heading'>Time it!</h1>
        <span className='two-buttons'>
          <button id="start_stop" className='btn btn-info btn-block' onClick={(this.startStopSession)}>start/stop</button>
          <button id='reset' className='btn btn-danger btn-block' onClick={this.handleReset}>reset</button>
        </span>
        <div id='controls'>
          <div id='session-label'><h4>Session Length </h4><h4 id='session-length'>{this.state.sessionLength}</h4>
            <img id='session-increment' className='inc'
              src='http://www.clker.com/cliparts/8/8/2/2/11949856011357057871arrow-up-green_benji_par_01.svg' alt='inc session'
              onClick={() => {
                if(this.state.minutes < 60 && this.state.pause) {
                  this.setState({
                    minutes: this.state.minutes + 1,
                    seconds: 0,
                    sessionLength: this.state.sessionLength + 1
                  });
                }
              }}
              />
            <img id='session-decrement' className='dec'
              src='http://www.clker.com/cliparts/8/8/2/2/11949856011357057871arrow-up-green_benji_par_01.svg' alt='inc session'
              onClick={() => {
                if(this.state.minutes > 1 && this.state.pause)
                  this.setState(
                    {
                      minutes: this.state.minutes - 1,
                      seconds: 0,
                      sessionLength: this.state.sessionLength - 1
                    }
                  );
              }}/>
          </div>
          <div id='break-label'> <h4>Break Length </h4><h4 id='break-length'>{this.state.breakLength}</h4>
           <img id='break-increment' className='inc'
              src='http://www.clker.com/cliparts/8/8/2/2/11949856011357057871arrow-up-green_benji_par_01.svg' alt='inc session'
              onClick={() => {
                if(this.state.breakLength < 60 && this.state.pause) this.setState(
                  {
                    seconds: 0,
                    breakLength: this.state.breakLength + 1
                  }
                )
              }}
              />
            <img id='break-decrement' className='dec'
              src='http://www.clker.com/cliparts/8/8/2/2/11949856011357057871arrow-up-green_benji_par_01.svg' alt='inc session'
              onClick={() => {
                if(this.state.breakLength > 1  && this.state.pause) this.setState(
                  {
                    seconds: 0,
                    breakLength: this.state.breakLength - 1
                  }
                )
              }}/>
          </div>
        </div>
        <Display minutes={this.state.minutes} seconds={this.state.seconds}
          timerLabel = {this.state.break? "BREAK": "SESSION"} />
    </div>
    );
  }
}
export default App;
let display = (minutes, seconds) => {
  const mins = minutes < 10? `0${minutes}`: `${minutes}`;
  const secs = seconds < 10? `0${seconds}`: `${seconds}`;
  return `${mins}:${secs}`;
}

class Display extends React.Component {
  render() {
    return (
      <div>
        <div id='timer-label'>
          {this.props.timerLabel}
        </div>
        <div id='time-left'>
          {display(this.props.minutes,this.props.seconds)}
        </div>
      </div>
    );
  }
}
const Alarm = () => {
  return(
  <audio id='beep' src='http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav'></audio>
  );

}
