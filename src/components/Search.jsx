import React from 'react'
import { Input } from 'semantic-ui-react'

export const Search = ({ placeholder, onChangeVal, onGo, isLoading }) => (
    <Input
        fluid action={{ icon: 'search', color: 'yellow', onClick: () => onGo(), loading: isLoading }}
        placeholder={placeholder}
        onChange={e => onChangeVal(e.target.value)}
    />
);