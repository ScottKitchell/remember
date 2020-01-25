import React from 'react'
import styled from 'styled-components/native'
import {NoteBundle, Note} from 'data-store/data-types'
import {colors} from 'theme'

export interface BundleAvatarProps {
  creationType: 'user' | 'reminder'
}

export const BundleAvatar = styled.View<BundleAvatarProps>`
  height: 36px;
  width: 36px;
  border-radius: 25px;
  background-color: ${props => (props.creationType === 'user' ? colors.primary : colors.secondary)};
`
