import moment from "moment";

export function formatDateTime(dateString: string,type:string) {
    const date = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    console.log(dateString,"date---->")

    if(type === "Date_time"){
      if (date.isSame(today, 'day')) {
        // Today's date
        return date.format('hh:mm A'); // Return time only
    } else if (date.isSame(yesterday, 'day')) {
        // Yesterday's date
        return 'Yesterday';
    } else {
        // Any other date
        return date.format('D MMM'); // Return day and month (e.g., "28 Apr")
    }

    }else{
      return date.format('hh:mm A'); // Return time only
    }

}

export const getFormattedDate = (dateString: string) => {
    const date = moment(dateString);
    if (date.isSame(moment(), 'day')) {
      return 'Today';
    } else if (date.isSame(moment().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else {
      return date.format('LL');
    }
  };


  export function convertSeconds(seconds:number) {
    if (seconds < 60) {
        return `${seconds} s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} m ${remainingSeconds} s`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const remainingFinalSeconds = remainingSeconds % 60;
        return `${hours} h, ${minutes} m and ${remainingFinalSeconds} s`;
    }
}