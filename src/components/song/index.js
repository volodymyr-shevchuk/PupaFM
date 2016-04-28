'use strict'

import React, { Component, PropTypes } from 'react'

import './index.scss'
import '../../assets/font/iconfont.scss'

import SongTitle from './title'
import Progress from './progress'
import Controls from './controls'
import Cover from './cover'
import Lyric from './lyric'

class Song extends Component {

  constructor (props) {
    super(props)
    this.state = {
      time: 0,
      percent: '0%'
    }
  }

  updateState (props) {
    const nState = Object.assign({}, this.state, props)
    this.setState(nState)
  }

  componentDidMount () {
    this.listenUpdate()
  }

  pauseSong () {
    this.refs.player.pause()
  }

  playSong () {
    this.refs.player.play()
  }

  handlePause () {
    this.props.pause ? this.playSong() : this.pauseSong()
    this.props.onPauseClick()
  }

  handleNext () {
    this.props.onNextClick()
  }

  handleStar () {
    this.props.onStarClick()
  }

  handleNever () {
    this.props.onNeverClick()
  }

  handleShowLyric () {
    this.props.onShowLyric()
  }

  listenUpdate () {
    // 监听时间更新
    this.refs.player.addEventListener('timeupdate', () => {
      let pt = this.refs.player.currentTime
      let dt = this.refs.player.duration

      this.updateState({
        percent: pt / dt * 100 + '%',
        time: pt
      })
    })

    // 监听播放结束
    this.refs.player.addEventListener('ended', () => {
      this.handleNext()
    })
  }

  render () {
    const { song, pause, isShowLyric, isFetchingLyric } = this.props

    return (
      <div className="fullplayer">
        <div className="playing-info">

          <audio ref='player' src={ song.url } preload autoPlay />

          <SongTitle { ...song } time={ this.state.time } pause={ pause }
            onPause={ () => { this.handlePause() } }
          />

          <Progress percent={ this.state.percent } />

          <div className="below-progress">
            <span className="iconfont icon-lyric"
              onClick={ () => { this.handleShowLyric() } }>
            </span>
          </div>

          <Controls { ...song }
            onNext={ () => { this.handleNext() } }
            onStar={ () => { this.handleStar() } }
            onTrash={ () => { this.handleNever() } }
          />

        </div>

        <Cover { ...song } isFetchingLyric={ isFetchingLyric } />

        <Lyric { ...song } isShowLyric={ isShowLyric }
          time={ this.state.time }
          closeLyric={ () => { this.handleShowLyric() } }
        />

      </div>
    )
  }
}

Song.propTypes = {
  song: PropTypes.object.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onStarClick: PropTypes.func.isRequired,
  onPauseClick: PropTypes.func.isRequired,
  onNeverClick: PropTypes.func.isRequired,
  onShowLyric: PropTypes.func.isRequired,
  isShowLyric: PropTypes.bool.isRequired,
  pause: PropTypes.bool.isRequired,
  isFetchingLyric: PropTypes.bool.isRequired
}

export default Song