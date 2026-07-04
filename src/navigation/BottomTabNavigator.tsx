import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TABS } from '@/constants/strings';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { useTheme } from '@/theme/ThemeProvider';
import type { TabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconName = keyof typeof Ionicons.glyphMap;

/** Map each tab to its active/inactive icon. */
function iconFor(route: keyof TabParamList, focused: boolean): IoniconName {
  switch (route) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Search':
      return focused ? 'search' : 'search-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
  }
}

export function BottomTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtle,
        tabBarStyle: {
          backgroundColor: colors['tab-bar'],
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={iconFor(route.name, focused)} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: TABS.home }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: TABS.search }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: TABS.profile }} />
    </Tab.Navigator>
  );
}
