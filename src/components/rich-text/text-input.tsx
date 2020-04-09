import React, { Component, RefObject } from 'react'
import {
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  StyleProp,
  TextStyle,
} from 'react-native'
import RichText from './text'

type RichTextInputProps = {
  onHashtagEntering?: (tag: string) => any
  hashtagStyle?: StyleProp<TextStyle>
  urlStyle?: StyleProp<TextStyle>
} & TextInputProps

type RichTextInputState = {
  cursor: number
}

export default class RichTextInput extends Component<RichTextInputProps, RichTextInputState> {
  static defaultProps = {
    value: '',
  }

  textInputRef: RefObject<TextInput>

  constructor(props: RichTextInputProps) {
    super(props)
    this.state = { cursor: -1 }
    this.textInputRef = React.createRef()
  }

  shouldComponentUpdate(nextProps: RichTextInputProps, nextState: RichTextInputState) {
    // Don't update for cursor changes
    return nextState.cursor === this.state.cursor && nextProps.value !== this.props.value
  }

  isFocused = () => this.textInputRef.current && this.textInputRef.current.isFocused()

  focus = () => this.textInputRef.current && this.textInputRef.current.focus()

  blur = () => this.textInputRef.current && this.textInputRef.current.blur()

  clear = () => {
    if (this.props.onChangeText) this._handleChangeText('')
    else if (this.textInputRef.current) this.textInputRef.current.clear()
  }

  insertAtCursor = (
    chars: string,
    startIndex = this.state.cursor,
    endIndex = this.state.cursor,
  ) => {
    // console.log(`insertAtCursor - "${chars}" at ${startIndex}-${endIndex}`);
    if (!this.props.onChangeText) return

    const text = this.props.value
      ? this.props.value.slice(0, startIndex).concat(chars, this.props.value.slice(endIndex))
      : chars

    const cursorNowAt = startIndex + chars.length
    this._handleChangeText(text, cursorNowAt)
  }

  autoCompleteWord = (chars: string) => {
    const cursor = this.state.cursor
    const fromIndex = this._getWordStartIndex(this.props.value ?? '', cursor)
    this.insertAtCursor(chars + ' ', fromIndex, cursor)
  }

  _handleChangeText = (text: string, cursor = this.state.cursor) => {
    // console.log(`onChangeText - cursor was at ${cursor}`);
    this._checkForKeyWords(text, cursor)
    if (this.props.onChangeText) this.props.onChangeText(text)
  }

  _handleChangeSelection = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    this.setState({ cursor: event.nativeEvent.selection.start })
    if (this.props.onSelectionChange) this.props.onSelectionChange(event)
  }

  _checkForKeyWords = (text: string, cursor = this.state.cursor) => {
    if (!this.props.onHashtagEntering) return
    const wordStartIndex = this._getWordStartIndex(text, cursor)
    const tag = text[wordStartIndex] === '#' ? text.slice(wordStartIndex + 1, cursor + 1) : ''
    this.props.onHashtagEntering(tag)
  }

  _getWordStartIndex = (text: string, cursor: number) => {
    for (let i = cursor; i >= 0; i--) if (text[i] === ' ') return i + 1

    return 0
  }

  render() {
    const {
      value,
      onHashtagEntering,
      hashtagStyle,
      hashtagClassName,
      urlStyle,
      urlClassName,
      ...textInputProps
    } = this.props

    return (
      <TextInput
        ref={this.textInputRef}
        {...textInputProps}
        onChangeText={this._handleChangeText}
        onSelectionChange={this._handleChangeSelection}
      >
        <RichText hashtagStyle={hashtagStyle} urlStyle={urlStyle} shortUrl={false}>
          {value ?? '' }
        </RichText>
      </TextInput>
    )
  }
}
