import React from 'react'
import {Text, TextInput} from 'react-native'
import PropTypes from 'prop-types'
import {RichText} from 'components/rich-text/text'

const URL_REGEX = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/

export class RichTextInput extends React.Component {
  static propTypes = {
    ...TextInput.propTypes,
    onHashtagEntering: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      cursor: 0,
    }
    this.textInputRef = React.createRef()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Don't update for cursor changes
    return nextState.cursor === this.state.cursor && nextProps.value !== this.props.value
  }

  clear = () => {
    if (this.props.onChangeText) this._handleChangeText('')
    else this.textInputRef.current.clear()
  }

  isFocused = () => this.textInputRef.current.isFocused()

  insertAtCursor = (chars, startIndex = this.state.cursor, endIndex = this.state.cursor) => {
    // console.log(`insertAtCursor - "${chars}" at ${startIndex}-${endIndex}`);
    if (!this.props.onChangeText) return
    const text = this.props.value
      .slice(0, startIndex)
      .concat(chars, this.props.value.slice(endIndex))
    const cursorNowAt = startIndex + chars.length
    this._handleChangeText(text, cursorNowAt)
  }

  autoCompleteWord = chars => {
    const cursor = this.state.cursor
    const fromIndex = this._getWordStartIndex(this.props.value, cursor)
    this.insertAtCursor(chars + ' ', fromIndex, cursor)
  }

  _handleChangeText = (text, cursor = this.state.cursor) => {
    // console.log(`onChangeText - cursor was at ${cursor}`);
    this._checkForKeyWords(text, cursor)
    if (this.props.onChangeText) this.props.onChangeText(text)
  }

  _handleChangeSelection = event => {
    // console.log(`onChangeCursor - from ${this.state.cursor} to ${event.nativeEvent.selection.start}`);
    this.setState({cursor: event.nativeEvent.selection.start})
    if (this.props.onSelectionChange) this.props.onSelectionChange(event)
  }

  _checkForKeyWords = (text, cursor = this.state.cursor) => {
    if (this.props.onHashtagEntering) {
      const wordStartIndex = this._getWordStartIndex(text, cursor)
      if (text[wordStartIndex] === '#') {
        const tag = text.slice(wordStartIndex + 1, cursor + 1)
        // console.log(`onHashtagEntering - "#${tag}"`);
        this.props.onHashtagEntering(tag)
      } else this.props.onHashtagEntering(null)
    }
  }

  _getWordStartIndex = (text, cursor) => {
    for (let i = cursor; i >= 0; i--) {
      if (text[i] === ' ') return i + 1
    }
    return 0
  }

  render() {
    const {value, onHashtagEntering, hashtagStyle, urlStyle, ...props} = this.props
    return (
      <TextInput
        ref={this.textInputRef}
        {...props}
        onChangeText={this._handleChangeText}
        onSelectionChange={this._handleChangeSelection}
      >
        <RichText hashtagStyle={hashtagStyle} urlStyle={urlStyle} shortUrl={false}>
          {value}
        </RichText>
      </TextInput>
    )
  }
}
