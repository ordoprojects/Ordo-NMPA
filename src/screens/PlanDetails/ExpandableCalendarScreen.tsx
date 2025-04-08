import React, { useRef, useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import testIDs from './testIDs';
import { agendaItems, getMarkedDates } from './agendaitems';
import AgendaItem from './AgendaItem';
import { getTheme, themeColor, lightThemeColor } from './theme'

const leftArrowIcon = require('../../assets/images/previous.png');
const rightArrowIcon = require('../../assets/images/next.png');


interface DealerActivity {
  account_id: number;
  status: string;
}

interface DealerData {
  title: string;
  data: DealerActivity[];
}

interface Props {
  // weekView?: boolean;
  dealerArray?: DealerData[];
  navigation: any;
}

const ExpandableCalendarScreen = (props: Props) => {
  const { dealerArray, navigation } = props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  // const onDateChanged = useCallback((date, updateSource) => {
  //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  // }, []);

  // const onMonthChange = useCallback(({dateString}) => {
  //   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
  // }, []);

  // const accountPressed = useCallback(() => {
  //   Alert.alert('Show me more');
  // }, []);




  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} navigation={navigation} />;
  }, []);

  return (
    <CalendarProvider
      date={dealerArray[0]?.title}
      // onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
      showTodayButton
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
    // todayBottomMargin={16}
    >

      <ExpandableCalendar
        testID={testIDs.expandableCalendar.CONTAINER}
        // horizontal={false}
        // hideArrows
        // disablePan
        // hideKnob
        // initialPosition={ExpandableCalendar.positions.OPEN}
        calendarStyle={styles.calendar}
        // headerStyle={styles.header} // for horizontal only
        disableWeekScroll
        theme={theme.current}
        // disableAllTouchEventsForDisabledDays
        firstDay={1}
        //   markedDates={marked.current}
        leftArrowImageSource={leftArrowIcon}
        rightArrowImageSource={rightArrowIcon}
      // animateScroll
      // closeOnDayPress={false}
      />

      <AgendaList
        sections={dealerArray}
        renderItem={renderItem}
        // scrollToNextEvent
        sectionStyle={styles.section}
      // dayFormat={'yyyy-MM-d'}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'lightgrey'
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  }
});