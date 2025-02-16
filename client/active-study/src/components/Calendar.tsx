import { eachDayOfInterval, getWeek } from 'date-fns';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';

const Calendar = () => {

  const isMatch = useMediaQuery('(min-width: 600px)')

  const [daysOfWeek, setDaysOfWeek] = useState<Date[] | null>(null)

  useEffect(() => {
    const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - new
      Date().getDay()));
    const lastDayOfWeek = new Date(new Date().setDate(new Date().getDate() + (6 - new
      Date().getDay())));
    setDaysOfWeek(eachDayOfInterval({ start: firstDayOfWeek, end: lastDayOfWeek }))
  }, [])

  const goToNextWeek = () => {
    const firstDayOfWeek = new Date(new Date(daysOfWeek![6]).setDate(new Date(daysOfWeek![6]).getDate() + 1));
    const lastDayOfWeek = new Date(new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() + 6));
    setDaysOfWeek(eachDayOfInterval({ start: firstDayOfWeek, end: lastDayOfWeek }))
  }

  const goToPreviousWeek = () => {
    const firstDayOfWeek = new Date(new Date(daysOfWeek![0]).setDate(new Date(daysOfWeek![0]).getDate() - 7));
    const lastDayOfWeek = new Date(new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() + 6));
    setDaysOfWeek(eachDayOfInterval({ start: firstDayOfWeek, end: lastDayOfWeek }))
  }

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  return (
    <div>
      {daysOfWeek && <>
        <Box
          display={'flex'}
          justifyContent={'center'}
          marginTop={2}
         >
          {daysOfWeek[0].toLocaleDateString(
            'en-US', { month: 'long', year: 'numeric' }
          )}
        </Box>
        <Box display={'flex'} justifyContent={'center'}>
          <Button onClick={goToPreviousWeek} sx={{
            borderRadius: isMatch ? '50%' : 0,
            paddingY: 2.7, paddingX: 1
          }}>
            <ArrowBackIcon />
          </Button>
          <Box
            display={'flex'}
            flexDirection={isMatch ? 'row' : 'column'}
            justifyContent={'space-between'}
            width={isMatch ? '70%' : '100%'}
          >
            {
              daysOfWeek.map((day) => (
                <Button key={day.toString()} size="large" sx={{
                  borderRadius: isMatch ? '50%' : 0, paddingY: 2,
                  backgroundColor: isToday(day) ? 'red' : 'transparent',
                  color: isToday(day) ? 'white' : 'black'
                }}>
                  <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <small>{day.toLocaleDateString('en-US', { weekday: 'short' })}</small>
                    {day.getDate()}
                  </Box>
                </Button>
              ))}
          </Box>

          <Button onClick={goToNextWeek} sx={{ borderRadius: isMatch ? '50%' : 0, paddingY: 2.7, paddingX: 1 }}>
            <ArrowForwardIcon />
          </Button>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'center'}
        >{getWeek(daysOfWeek[0])} week of the year</Box>
      </>}
    </div>
  );
};

export default Calendar;
