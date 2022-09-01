import React, { useState } from 'react'
import { StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { Text } from './text'
import { Box } from './box'
import RNDateTimePicker from '@react-native-community/datetimepicker';

export const DateTimePicker = ({ value, label, minimumDate, error, onChange }) => {
  const [showAndroidDate, setShowAndroidDate] = useState(false)
  const date = value ? new Date(value) : new Date()
  return (
    <Box style={styles.container}>
      <Text variant='label'>{label}</Text>
      <Box style={styles.datePicker}>
        {
          Platform.select({
            ios: <RNDateTimePicker
              value={date}
              mode='datetime'
              minimumDate={minimumDate}
              onChange={(_, date) => {
                onChange(date)
              }}
            />,
            android: <TouchableOpacity style={styles.androidPicker} onPress={() => setShowAndroidDate(!showAndroidDate)}>
              <>
                {
                  showAndroidDate && <RNDateTimePicker
                    style={styles.picker}
                    value={date}
                    mode='datetime'
                    minimumDate={minimumDate}
                    onChange={(_, date) => {
                      setShowAndroidDate(false)
                      onChange(date)
                    }}
                  />
                }
                <Text>{date.toISOString().slice(0, 10)}</Text>
              </>
            </TouchableOpacity>
          })
        }
      </Box>
      {!!error && <Text color="error">{error}</Text>}
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    marginBottom: 10,
  },
  datePicker: {
    flex: 1,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    paddingRight: 10
  },
  picker: {
    flex: 1,
    marginLeft: -30,
    width: 150
  },
  androidPicker: {
    backgroundColor: '#e2e2e2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  error: {
    color: 'red',
    fontSize: 12
  }
});