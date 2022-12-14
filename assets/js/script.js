// an array with hours in 12 hour format for calendar display 
// an array with hours in 24 hour format for color coding time blocks
var hoursBlockTwelve = [];
var hoursBlockTwentyFour = [];

// to keep track of the data index numbers of clicked save buttons
// to keep track of the corresponding saved events
var storedIndexNumber = [];
var storedSavedEvent = [];

// stored data index numbers of clicked save buttons
// stored saved events
var getStoredIndexNumber;
var getStoredEvent;

// display calendar
function displayCalendar() {

    const timeInHours = {
        morningBlocks: [9, 10, 11],
        afternoonBlocks: [12, 1, 2, 3, 4, 5],
        // Moment.js
        timeNow: moment().get('hour')
    };

    // morning hours in 12 hour format and separately in 24 hour format
    for (var i = 0; i < timeInHours.morningBlocks.length; i++) {
        hoursBlockTwelve.push(timeInHours.morningBlocks[i] + ":00 am");
        hoursBlockTwentyFour.push(timeInHours.morningBlocks[i]);
    }

    // afternoon hours in 12 hour format and separately in 24 hour format
    for (var i = 0; i < timeInHours.afternoonBlocks.length; i++) {
        hoursBlockTwelve.push(timeInHours.afternoonBlocks[i] + ":00 pm");
        hoursBlockTwentyFour.push(24 - (timeInHours.afternoonBlocks[0] - i));
    }

    // calendar in 12 hour format; includes time bocks, text area to enter events, and save event buttons
    for (var i = 0; i < hoursBlockTwelve.length; i++) {

        var divBlockHour = $("<div>");
        $(".container").append(divBlockHour);

        var divTime = $("<div>");
        divBlockHour.append(divTime);

        var divEvent = $("<div>");
        divBlockHour.append(divEvent);

        var divSaveButton = $("<div>");
        divBlockHour.append(divSaveButton);

        // grid (Bootstrap)
        // added several class attributes for other styling
        divBlockHour.attr("class", "row");

        // color coded time blocks (present, future, and past)
        // using 24 hour format array
        var timeEqual = (hoursBlockTwentyFour[i] == timeInHours.timeNow);
        var timeGreaterThan = (hoursBlockTwentyFour[i] > timeInHours.timeNow);

        switch (true) {
            case (timeEqual):
                divTime.attr("class", "col-3 time-block pl-0 pr-0 present-border");
                divEvent.attr("class", "col-7 pl-0 pr-0 present");
                break;
            case (timeGreaterThan):
                divTime.attr("class", "col-3 time-block pl-0 pr-0 future-border");
                divEvent.attr("class", "col-7 pl-0 pr-0 future");
                break;
            default:
                divTime.attr("class", "col-3 time-block pl-0 pr-0 past-border");
                divEvent.attr("class", "col-7 pl-0 pr-0 past");
        };

        divSaveButton.attr("class", "col-2 pl-0 pr-0");

        // hours displayed in the calendar
        var eachHourBlock = $("<p>");
        eachHourBlock.attr("class", "pt-2 hour");
        eachHourBlock.text(hoursBlockTwelve[i]);
        divTime.append(eachHourBlock);

        // data index for each text area and save event button
        // used later to store and get data
        // where to enter events
        var eventEnter = $("<textarea data-index='" + i + "'>");
        eventEnter.attr("class", "description event-log");
        divEvent.append(eventEnter);

        // save event buttons
        // icon (Font Awesome)
        var saveEventButton = $("<button type='button' data-index='" + i + "'>" + "<i class='far fa-save'></i></button>");
        // click method
        saveEventButton.attr("class", "saveBtn save-btn-size").click(saveEvents);
        divSaveButton.append(saveEventButton);
    }

    // to display the current date
    // added class attribute for other styling
    $("#currentDay").text(moment().format('dddd, MMMM DD, YYYY')).addClass("current-date")

    // get from local storage and display the saved events
    getStoredIndexNumber = JSON.parse(localStorage.getItem("storedIndexNumber"));
    getStoredEvent = JSON.parse(localStorage.getItem("storedSavedEvent"));

    if (getStoredIndexNumber == null && getStoredEvent == null) {
        return;
    } else {
        // use of data index numbers
        for (var i = 0; i < getStoredIndexNumber.length; i++) {
            $("textarea[data-index=" + getStoredIndexNumber[i] + "]").append(getStoredEvent[i]);
        };
        storedIndexNumber = getStoredIndexNumber;
        storedSavedEvent = getStoredEvent;
    }
}

function saveEvents() {
    var eventLogged = $("textarea[data-index=" + $(this).data("index") + "]");
    // checking stored saved events
    // find the position of the existing event and replace it with the new event, if applicable
    switch (true) {
        case (storedIndexNumber.includes($(this).data("index"))):
            var indexArrayClicked = storedIndexNumber.indexOf($(this).data("index"));
            storedSavedEvent[indexArrayClicked] = eventLogged.val();
            break;
        default:
            // if there is no existing event, push to the arrays
            storedIndexNumber.push($(this).data("index"));
            storedSavedEvent.push(eventLogged.val());
    };

    // local storage 
    // data index numbers of the clicked save buttons 
    // corresponding saved events 
    localStorage.setItem("storedIndexNumber", JSON.stringify(storedIndexNumber));
    localStorage.setItem("storedSavedEvent", JSON.stringify(storedSavedEvent));
}

// display calendar
displayCalendar();
