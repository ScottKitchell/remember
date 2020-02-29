import React, { ReactNode } from 'react'
import { Text, TextProps, StyleProp, TextStyle } from 'react-native'

const URL_REGEX = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/

const shortenUrl = (url: string) => {
  const domain = url.replace(/(^\w+:|^)\/\//, '')
  return domain.length <= 28 ? domain : domain.slice(0, 24) + '...'
}

type ElementString = (string | Element)[]

type RichTextProps = TextProps & {
  onHashtagPress: (word: string) => void
  onUrlPress: (word: string) => void
  hashtagStyle?: StyleProp<TextStyle>
  urlStyle?: StyleProp<TextStyle>
  shortUrl?: boolean
  children: string
}

const RichText = ({
  onHashtagPress,
  onUrlPress,
  hashtagStyle,
  urlStyle,
  shortUrl,
  children,
  ...containerProps
}: RichTextProps) => {
  const parseLine = (lineText: string) =>
    lineText.split(' ').reduce((textArray: ElementString, word: string, index: number) => {
      const richWord =
        word[0] === '#' ? (
          <Text onPress={() => onHashtagPress(word)} key={index} style={hashtagStyle}>
            {word}
          </Text>
        ) : word.match(URL_REGEX) ? (
          <Text onPress={() => onUrlPress(word)} key={index} style={urlStyle}>
            {shortUrl ? shortenUrl(word) : word}
          </Text>
        ) : (
          word
        )
      return textArray.concat(index ? [' ', richWord] : [richWord])
    }, [])

  const richText = children
    .split('\n')
    .reduce((textArray: ElementString, line: string, lineIndex: number) => {
      const nextLine = parseLine(line)
      return textArray.concat(lineIndex ? ['\n', nextLine] : [nextLine])
    }, [])

  return <Text {...containerProps}>{richText}</Text>
}

RichText.defaultProps = {
  onHashtagPress: () => true,
  onUrlPress: () => true,
  shortUrl: true,
}

export default RichText
