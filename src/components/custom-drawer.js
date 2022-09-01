import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Text } from './text';
import { Box } from './box';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from 'screens/auth/store';

export default props => {
  const { state, navigation, descriptors } = props;
  const { index, routes } = state;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  return (
    <>
      <DrawerContentScrollView style={styles.container} {...props}>
        <Box style={styles.header}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg' }}
          />
          <Box>
            <Text color="#333333">Hello</Text>
            <Text color='#272727' variant='strong'>{user.name}</Text>
          </Box>
        </Box>

        {routes.map((route, position) => {
          const isFocused = (index === position);
          const drawerLabel = descriptors[route.key] && descriptors[route.key].options.drawerLabel || route.name
          return (
            <DrawerItem
              key={route.key}
              label={({ focused }) => {
                return (
                  <Text variant='strong' style={focused ? styles.activeText : styles.inactiveText}>
                    {drawerLabel}
                  </Text>
                )
              }}
              icon={descriptors[route.key]?.options?.drawerIcon}
              style={isFocused ? styles.activeContainer : styles.inActiveContainer}
              onPress={() => navigation.navigate(`${route.name}`)}
              focused={isFocused}
            />
          )
        })}
      </DrawerContentScrollView>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Pressable style={{ flex: 1, paddingBottom: 10 }} onPress={() => dispatch(logoutRequest())}>
          <Box flex={1} flexDirection="row" justifyContent="center" alignItems="flex-end">
            <MaterialIcons name='logout' size={22} />
            <Text> Log Out</Text>
          </Box>
        </Pressable>
      </SafeAreaView>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
    paddingBottom: 40
  },
  activeContainer: {
    borderColor: '#A4845B',
    borderWidth: 1,
    backgroundColor: '#FFECD2',
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 16,
    paddingLeft: 10
  },
  activeText: {
    marginLeft: -20
  },
  inActiveContainer: {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 10

  },
  inactiveText: {
    color: '#828282',
    marginLeft: -20
  },
  header: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10
  }
});
