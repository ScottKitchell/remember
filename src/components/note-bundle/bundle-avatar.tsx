import React from 'react'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { colors } from 'theme'

export interface BundleAvatarProps {
  creationType: 'user' | 'reminder'
}

export const BundleAvatar = ({ creationType }: BundleAvatarProps) => (
  <BundleAvatarCircle creationType={creationType}>
    <AvatarIcon name={creationType === 'user' ? 'user' : 'bell'} />
  </BundleAvatarCircle>
)

export const BundleAvatarCircle = styled.View<BundleAvatarProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 25px;
  background-color: ${props => (props.creationType === 'user' ? colors.primary : colors.secondary)};
`

const AvatarIcon = styled(Icon)`
  font-size: 22px;
  color: ${colors.textLight};
`
