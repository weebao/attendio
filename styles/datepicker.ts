export const datepickerStyles = {
  dateNavBtnProps: {
    colorScheme: "blue"
  },
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      _hover: {
        background: 'blue.300',
      }
    },
    isInRangeBtnProps: {
      color: "yellow",
    },
    selectedBtnProps: {
      background: "blue.400",
      color: "blue.800",
    },
    todayBtnProps: {
      background: "whiteAlpha.300",
    }
  },
  inputProps: {
    size: "md"
  },
  popoverCompProps: {
    popoverContentProps: {
      background: "gray.700",
      color: "white",
    },
  },
  calendarPanelProps: {
    contentProps: {
      borderWidth: 0,
    },
    headerProps: {
      padding: '5px',
    },
    dividerProps: {
      display: "none",
    },
  },
  weekdayLabelProps: {
    fontWeight: 'normal'
  },
  dateHeadingProps: {
    fontWeight: 'semibold'
  }
}