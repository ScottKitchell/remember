import React, {ReactNode} from 'react'
import {View, Text, StatusBar, SafeAreaView, FlatList, StyleSheet} from 'react-native'
import {colors} from 'theme'
import {Search} from 'components/search'

type ScreenProps = {
  children?: ReactNode
}

const Screen = ({children}: ScreenProps) => {
  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{backgroundColor: colors.primary, flex: 1}}>{children}</SafeAreaView>
    </>
  )
}

const NotesScreen = ({children}: ScreenProps) => {
  const minimizeSearch = false

  const search = (value: string) => {
    console.log('search for:', value)
  }

  return (
    <Screen>
      <Search onSearchChange={search} minimize={minimizeSearch} />
      <View style={styles.notesView}>
        <Text>stuff </Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  notesView: {
    padding: 10,
    backgroundColor: colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 50,
    flex: 1,
  },
})

export default NotesScreen
