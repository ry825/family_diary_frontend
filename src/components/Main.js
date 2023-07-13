import React, { useContext} from 'react'
import {ApiContext} from '../context/ApiContext'
import AddDiary from './AddDiary';
import DiaryDetailEdit from './DiaryDetailEdit'

import Grid from '@mui/material/Grid';

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'



const Main = () => {

    const {
        diaryList,
        
        setLoadTimes,
        setPagination,
        setBaseYear,
        setBaseMonth,
        setYear,
        setMonth,

        handleSelect,
        eventClick
    } = useContext(ApiContext)

    const myEvents = () => {
        const newMyEvents = []
        diaryList.forEach(function(diary){
            const myEventsArray = {
                id:diary.id,
                title:diary.title,
                start:diary.date,
            }
            newMyEvents.push(myEventsArray)
        })
        return newMyEvents
    }

    const handleEventClick = (eventInfo) => {
        const event = eventInfo.event
        const eventId = event.id
        const date = event.startStr
        eventClick(date, eventId)
    }

    const handleHeaderButtonClick = (info) => {
        setLoadTimes((previous) => previous + 1)
        const date = info.view.currentStart;
        const newMonth = date.getMonth() + 1
        setPagination(true)
        setBaseYear(date.getFullYear())
        setBaseMonth(newMonth)
        setYear(date.getFullYear())
        setMonth(newMonth)
    }
    
    const commonCalendarProps = {
        locale:"ja", // ロケール設定。
        plugins:[timeGridPlugin, dayGridPlugin, interactionPlugin], // 週表示、月表示、日付等のクリックを可能にするプラグインを設定。
        initialView:"dayGridMonth", // カレンダーの初期表示設定。この場合、週表示。
        selectable:true, // 日付選択を可能にする。interactionPluginが有効になっている場合のみ。
        businessHours:{ // ビジネス時間の設定。
            daysOfWeek: [1, 2, 3, 4, 5], // 0:日曜 〜 7:土曜
            startTime: '00:00',
            endTIme: '24:00'
        },
        weekends:true, // 週末を強調表示する。
        titleFormat:{ // タイトルのフォーマット。(詳細は後述。※1)
            year: 'numeric',
            month: 'short'
        },
        headerToolbar:{ // カレンダーのヘッダー設定。(詳細は後述。※2)
            start: 'title',
            center: 'prev, next, today',
            end: ''
        },
        editable: true,
        datesSet:handleHeaderButtonClick,
        eventClick:handleEventClick,
        dateClick:handleSelect
    }

    return (
        <div>
            {/* modal */}
            <AddDiary />
            
            {/* Diaryの詳細 */}
            <DiaryDetailEdit />

            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={9}>
                    {diaryList 
                        ? (
                            <FullCalendar
                                {...commonCalendarProps}
                                events={myEvents()}
                            />
                        ):(
                            <FullCalendar
                                {...commonCalendarProps}
                            />
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

export default Main