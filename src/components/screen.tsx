import React, { ReactNode } from 'react'
import { StatusBar } from 'react-native'
import { colors } from 'theme'
import styled from 'styled-components/native'

export type ScreenProps = {
  children?: ReactNode
}

const Screen = (props: ScreenProps) => (
  <>
    <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
    <ColoredSafeAreaView>{props.children}</ColoredSafeAreaView>
  </>
)

const ColoredSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.primary};
`

export default Screen
