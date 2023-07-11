import React, {createContext, useState, useEffect} from 'react'
import {axiosClient} from '../components/HandleAxiosError'
import { withCookies } from 'react-cookie'

export const ApiContext = createContext()

const ApiContextProvider = (props) => {
    const  token = props.cookies.get('jwt-token');
    const [userId, setUserId] = useState('')
    const [detailModalIsOpen, setDetailModalIsOpen] = useState(false)
    const [loadTimes, setLoadTimes] = useState(0)
    const [pagination, setPagination] = useState(false)
    const [baseYear, setBaseYear] = useState('')
    const [baseMonth, setBaseMonth] = useState('')
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [post, setPost] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [alignment, setAlignment] = useState('日記');
    const [videoList, setVideoList] = useState([]);
    const [videos, setVideos] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [photoList, setPhotoList] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [diaryList, setDiaryList] = useState([]);
    const [diary, setDiary] = useState([]);
    const [selectedDiary, setSelectedDiary] = useState(null);
    const [title, setTitle] = useState('');
    const [journal, setJournal] = useState('');
    const [date, setDate] = useState('');
    const [schedule, setSchedule] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [scheduleList, setScheduleList] = useState([]);
    const [summary, setSummary] = useState(null);
    const [description, setDescription] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [photoEnlarge, setPhotoEnlarge] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editJournal, setEditJournal] = useState('');
    const [editPhotos, setEditPhotos] = useState([]);
    const [editVideos, setEditVideos] = useState([]);
    const [deleteVideoList, setDeleteVideoList] = useState([]);
    const [deletePhotoList, setDeletePhotoList] = useState([]);

    
    // ユーザー固有のIDを取得
    useEffect(()=>{
        const getUserId =async() => {
            if(token){
                const newRes = await axiosClient.get('http://127.0.0.1:8000/api/user/info',{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `JWT ${token}`
                }})
                setUserId(newRes.data.id)
            }
        }
        getUserId()
    },[token])

    useEffect(() => {
        if(loadTimes === 1){
            return
        }else if(userId){
            getDiaries();
        }
    }, [baseMonth]);

    useEffect(()=> {
        setPagination(false)
        setDiaryList([])
        const getDiariesPageLoad = async() => {
            try {
                const res = await axiosClient.get('http://localhost:8000/api/diary/', {
                    params: {
                        filter_param: pagination,
                        user_id: userId
                    },
                    headers: {
                        'Authorization': `JWT ${token}`
                    }})
                    setDiaryList(res.data)
            }
            catch {
                console.log('error')
            }
        }
        // userIdが存在するときのみ初回ロードで日記取得処理
        if(userId){
            getDiariesPageLoad();
        }
    },[userId]);

    const getDiaries = async() => {
        try {
            const res = await axiosClient.get('http://localhost:8000/api/diary/', {
                params: {
                    filter_param: pagination,
                    user_id: userId,
                    year: baseYear,
                    month: baseMonth,
                },
                headers: {
                    'Authorization': `JWT ${token}`
                }})
            setDiaryList(res.data)
        }
        catch {
            console.log('error')
        }
    }

    const newVideo = async(id) => {
        let newEditVideo = []
        const uploadData = new FormData()
        uploadData.append('diary', id)

        // 動画が新規で登録されるか判定
        if(editVideos.length){
            editVideos.map(video => {
                if(!video.id){
                    uploadData.append('video', video, video.name)
                }else{
                    newEditVideo.push(video)
                }
            })
        }else{
            videos.map(video => {
                uploadData.append('video', video, video.name)
            })
        }
        try {
            const res = await axiosClient.post('http://127.0.0.1:8000/api/diary/video/', uploadData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `JWT ${token}`
                }})
            setVideoList([...videoList, res.data]);
            setModalIsOpen(false)
            setAlignment('日記')
            setVideos([])
            // 編集で追加した場合の処理
            if(editVideos.length){
                res.data.map((data) => {
                    newEditVideo.push(data)
                })
                setDiary(diary => ({
                    ...diary, related_video: newEditVideo
                }))
            }
        }
        catch {
            console.log('error')
        }
    }

    const newPhoto = async(id) => {
        let newEditPhoto = []
        const uploadData = new FormData()
        uploadData.append('diary', id)
        // 写真が新規で登録されるのか判定
        if(editPhotos.length){
            editPhotos.map(photo => {
                if(!photo.id){
                    uploadData.append('picture', photo, photo.name)
                }else{
                    newEditPhoto.push(photo)
                }
            })
        }else{
            photos.map(photo =>{
                uploadData.append('picture', photo, photo.name)
            })
        }

        try {
            const res = await axiosClient.post('http://127.0.0.1:8000/api/diary/picture/', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `JWT ${token}`
                }})
            setPhotoList([...photoList, res.data]);
            setModalIsOpen(false)
            setAlignment('日記')
            setPhotos([])
            // 編集で追加した場合の処理
            if(editPhotos.length){
                res.data.map((data) => {
                    newEditPhoto.push(data)
                })
                setDiary(diary => ({
                    ...diary, related_picture: newEditPhoto
                }))
            }
            setEditPhotos([])
        }
        catch {
            console.log('error')
        }
    }

    const newDiary = async() => {
        const uploadData = new FormData()
        uploadData.append('user', userId)
        uploadData.append('title', title)
        uploadData.append('journal', journal)
        uploadData.append('date', date)
        uploadData.append('year', year)
        uploadData.append('month', month)
        try {
            const res = await axiosClient.post('http://127.0.0.1:8000/api/diary/', uploadData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`
                }})
            setDiaryList([...diaryList, res.data]);
            setTitle('')
            setJournal('')
            setModalIsOpen(false)
            setAlignment('日記')
            setDiary(null)
            if(videos.length) {
                await newVideo(res.data.id)
            }
            if(photos.length) {
                await newPhoto(res.data.id)
            }
        }
        catch {
            console.log('error')
        }
    }

    const newSchedule = async() => {
        setPost(true)
        const uploadData = new FormData()
        uploadData.append('summary', summary)
        uploadData.append('description', description)
        uploadData.append('startTime', startTime)
        uploadData.append('endTime', endTime)
        try {
            const res = await axiosClient.post('http://127.0.0.1:8000/api/schedule/', uploadData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`
                }})
            setScheduleList([...scheduleList, res.data]);
            setModalIsOpen(false)
            setAlignment('日記')
            setSchedule(null)
        }
        catch {
            console.log('error')
        }
        setPost(false)
    }

    const getDetailDiary = async(id) => {
        try {
            const res = await axiosClient.get(`http://localhost:8000/api/diary/${id}`, {
                headers: {
                    'Authorization': `JWT ${token}`
                }})
            setDiary(res.data)
        }
        catch {
            console.log('error')
        }
    }

    const deleteDiary = async(id) => {
        try {
            await axiosClient.delete(
                `http://127.0.0.1:8000/api/diary/${id}/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setDiaryList(diaryList.filter((item) => item.id !== diary.id));
        } catch(error) {
            console.log(error);
        }
    }

    const deleteVideo = async() => {
        try {
            await axiosClient.delete(
                'http://127.0.0.1:8000/api/diary/video/',
                {
                    data: {
                        ids: deleteVideoList
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setDeleteVideoList([])
            // const innerArray = [...diary['related_video']]
            // const newInnerArray = []
            // for(let i =0; i<innerArray.length; i++){
            //     if(!deleteVideoList.includes(innerArray[i].id)){
            //         newInnerArray.push(innerArray[i])
            //     }
            // }
            // setDeleteVideoList([])
            // setDiary(diary => ({
            //     ...diary, related_video: newInnerArray
            // }))
        } catch {
            console.log('error');
        }
    }

    const deletePhoto = async() => {
        try {
            await axiosClient.delete(
                'http://127.0.0.1:8000/api/diary/picture/',
                {
                    data: {
                        ids: deletePhotoList
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${token}`,
                    },
                }
                );
                setDeletePhotoList([])
            // const innerArray = [...diary['related_picture']]
            // const newInnerArray = []
            // for(let i =0; i<innerArray.length; i++){
            //     if(!deletePhotoList.includes(innerArray[i].id)){
            //         newInnerArray.push(innerArray[i])
            //     }
            // }
            // setDiary(diary => ({
            //     ...diary, related_picture: newInnerArray
            // }))
        } catch {
            console.log('error');
        }
    }

    const deleteSchedule = async() => {
        try {
            await axiosClient.delete(
                `http://127.0.0.1:8000/api/schedule/${selectedSchedule.id}/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${token}`,
                    },
                }
            );
            setScheduleList(scheduleList.filter((item) => item.id !== selectedSchedule.id));
        } catch {
            console.log('error');
        }
    }

    const updateDiary = async() => {
        const uploadData = new FormData()
        uploadData.append('title', editTitle)
        uploadData.append('journal', editJournal)
        uploadData.append('date', date)
        uploadData.append('year', year)
        uploadData.append('month', month)
        try {
            const res = await axiosClient.put(`http://127.0.0.1:8000/api/diary/${diary.id}/`, uploadData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`
                }})
            setDiaryList([...diaryList, res.data]);
            setModalIsOpen(false)
            setAlignment('日記')
            setDiary(res.data)
            if(editVideos.length) {
                await newVideo(res.data.id)
            }
            if(editPhotos.length) {
                await newPhoto(res.data.id)
            }
        }
        catch {
            console.log('error')
        }
    }

    const handleSelect = (selectionInfo: any) => {
        //モーダル開く
        // includesで日付が一致したら、詳細ページのmodalを開くようにする
        const selectedDate = selectionInfo.startStr
        let diaryArray = []
        for(let i=0; i<diaryList.length; i++){
            diaryArray.push(diaryList[i].date)
        }
        if(diaryArray.includes(selectedDate)){
            return
        }else{
            setModalIsOpen(true)
        }

        setDate('')
        setDate(selectionInfo.startStr)
        setYear(selectionInfo.start.getFullYear())
        setMonth(selectionInfo.start.getMonth() + 1)
    }

    const eventClick = (date, eventId) => {
        let diaryArray = []
        for(let i=0; i<diaryList.length; i++){
            diaryArray.push(diaryList[i].date)
        }
        if(diaryArray.includes(date)){
            setDetailModalIsOpen(true)
            getDetailDiary(eventId)
        }
        setDate('')
        setDate(date)
        setYear(Number(date.substr(0, 4)))
        setMonth(Number(date.substr(5, 2)))
    }

    const cardMediaClick = (image) => {
        setSelectedPhoto(image)
        setPhotoEnlarge(true)
    }

    const editSave = () => {
        if(deletePhotoList.length){
            deletePhoto()
        }
        if(deleteVideoList.length){
            deleteVideo()
        }
        setDiary([])
        updateDiary()
        setAlignment('日記')
        setEditTitle(); 
        setEditJournal();
        setEditPhotos([]);
        setEditVideos([]);
        setIsEditMode(!isEditMode)
    }

    const alignmentOnChange = (event, newAlignment) => {
        if(newAlignment !== null){
            setAlignment(newAlignment)
        }
    }

    return (
        <ApiContext.Provider
            value={{
                userId,
                loadTimes,
                post,
                videoList,
                videos,
                photoList,
                photos,
                selectedVideo,
                selectedPhoto,
                modalIsOpen,
                diaryList,
                diary,
                selectedDiary,
                title,
                journal,
                date,
                schedule,
                selectedSchedule,
                scheduleList,
                summary,
                description,
                startTime,
                endTime,
                isLoaded,
                alignment,
                baseMonth,
                detailModalIsOpen,
                photoEnlarge,
                isEditMode,
                editTitle,
                editJournal,
                editPhotos,
                editVideos,
                deleteVideoList,
                deletePhotoList,

                setUserId,
                setDeletePhotoList,
                setDeleteVideoList,
                setEditVideos,
                setEditPhotos,
                setEditJournal,
                setEditTitle,
                setIsEditMode,
                setPhotoEnlarge,
                setLoadTimes,
                setVideoList,
                setVideos,
                setPhotoList,
                setPhotos,
                setSelectedVideo,
                setSelectedPhoto,
                setModalIsOpen,
                setDiaryList,
                setDiary,
                setSelectedDiary,
                setTitle,
                setJournal,
                setDate,
                setSchedule,
                setSelectedSchedule,
                setScheduleList,
                setSummary,
                setDescription,
                setStartTime,
                setEndTime,
                setIsLoaded,
                setAlignment,
                setPagination,
                setBaseYear,
                setBaseMonth,
                setMonth,
                setYear,
                setDetailModalIsOpen,

                getDiaries,
                newVideo,
                newPhoto,
                newDiary,
                newSchedule,
                deleteDiary,
                deleteVideo,
                deletePhoto,
                deleteSchedule,
                getDetailDiary,

                handleSelect,
                eventClick,
                cardMediaClick,
                editSave,
                alignmentOnChange,
            }}
        >
        {props.children}
        </ApiContext.Provider>
    )
}

export default withCookies(ApiContextProvider)