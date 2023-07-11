import React,{ useContext, useEffect } from 'react'
import Modal from 'react-modal';
import {ApiContext} from '../context/ApiContext';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveIcon from '@mui/icons-material/Remove';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';

import CardMedia from '@mui/material/CardMedia';

const AddDiary = () => {
    Modal.setAppElement('#root');

    const maxImageUpload = 10
    const maxVideoUpload = 5

    const handleEditPhoto = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click()
    }

    const handleEditVideo = () => {
        const fileInput = document.getElementById('mp4Input')
        fileInput.click()
    }

    const deletePhotoList = () => {
        photos.splice(0)
    }

    const deleteVideoList = () => {
        videos.splice(0)
    }

    const handleOnRemoveImage = (index) => {
        const newPhotoList=[...photos]
        newPhotoList.splice(index,1)
        setPhotos(newPhotoList)
    }

    const handleOnRemoveMp4 = (index) => {
        const newVideoList=[...videos]
        newVideoList.splice(index,1)
        setVideos(newVideoList)
    }

    //非同期処理でプレビュー用の動画を表示させる
    const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));
    const handleLoad = async () => {
        await sleep(1)
        setIsLoaded(!isLoaded);
    };

    const handleVideoUpload = (event) => {
        const newVideoList = videos
        newVideoList.push(event.target.files[0])
        setVideos(newVideoList)
        
        if(videos.length && videos[videos.length-1] === undefined){
            setVideos(videos.filter((video)=>(video !== undefined)))
        }
        //非同期処理の関数呼び出し
        handleLoad()
    }

    const deleteValue = () => {
        setModalIsOpen(false)
        setAlignment('日記')
    }



    const {
        title,
        journal,
        alignment,
        isLoaded,
        setIsLoaded,
        photos,
        videos,
        modalIsOpen,
        setAlignment,
        setPhotos,
        setVideos,
        setTitle,
        setJournal,
        setModalIsOpen,
        newDiary,
        alignmentOnChange,
    } = useContext(ApiContext)

    

    useEffect(()=>{
        if(photos.length && photos[photos.length-1] === undefined){
            setPhotos(photos.filter((photo)=>(photo !== undefined)))
        }
    },[photos])

    useEffect(()=>{
        if(videos.length && videos[videos.length-1] === undefined){
            setVideos(videos.filter((video)=>(video !== undefined)))
        }
    },[videos])


    return (
        <>

            <Modal 
                isOpen={modalIsOpen}
                onRequestClose={() => {setModalIsOpen(false); deletePhotoList(); deleteVideoList(); setAlignment('日記'); setTitle(''); setJournal('')}}
                style={{
                    overlay: {
                        zIndex: 1000,
                    },
                    content: {
                        zIndex: 1000,
                        width:'45%',
                        top: '30%',
                        left: '25%',
                        right: 'auto',
                        bottom: 'auto',
                        height:'50%'
                    },
                    inner: {
                        overflow: 'scroll'
                    }
                }}
            >
                <IconButton
                    style={{
                        top: -15,
                        left: -15,
                        color: "#aaa",
                    }}
                    onClick={() => setModalIsOpen(false)}
                >
                    <CancelIcon />
                </IconButton>
                <div className='toggle-button-group'>
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={alignmentOnChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="日記">日記</ToggleButton>
                        <ToggleButton value="写真">写真</ToggleButton>
                        <ToggleButton value="動画">動画</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <br/>
                <br/>
                {alignment === '日記' &&
                <div>
                    <div className='title-name'>
                        <Typography>タイトル</Typography>
                    </div>
                    <div className='title'>
                        <TextField
                            value={title}
                            type='text'
                            onChange={(event) => setTitle(event.target.value)}
                            style={{
                                width:'80%'
                            }}
                        />
                    </div>
                    <br/>
                    <div className='title-name'>
                        <Typography>本文</Typography>
                    </div>
                    <div className='title'>
                        <TextField
                            value={journal}
                            type='text'
                            multiline
                            onChange={(event) => setJournal(event.target.value)}
                            style={{
                                width:'80%'
                            }}
                        />
                    </div>
                </div>
                }
                {alignment === '写真' &&
                <div>
                    <input
                        type='file'
                        id='imageInput'
                        hidden='hidden'
                        accept="image/*,.png,.jpg,.jpeg,.gif"
                        onChange={(event) => setPhotos([...photos, event.target.files[0]])}
                    />
                    <br/>
                    {photos && photos.length >= maxImageUpload
                        ?
                            <IconButton onClick={handleEditPhoto} disabled>
                                <AddPhotoAlternateIcon className='photo' />
                            </IconButton>
                        :
                            <IconButton onClick={handleEditPhoto}>
                                <AddPhotoAlternateIcon className='photo' />
                            </IconButton>
                    }
                    {/* photoListにある画像をプレビュー */}
                    <Grid container>
                        {photos[photos.length-1] !== undefined && photos.map((photo, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    display: 'flex'
                                }}
                            >
                                <Grid item 
                                    style={{
                                        margin:'auto'
                                    }}
                                > 
                                    <IconButton
                                        style={{
                                            top: 6,
                                            left: -10,
                                            color: "#aaa",
                                        }}
                                        onClick={() => handleOnRemoveImage(i)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>

                                    <CardMedia
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={URL.createObjectURL(photo)}
                                        style={{
                                            width: "85%",
                                        }}
                                    />
                                </Grid>
                            </div>
                        ))}
                    </Grid>
                </div>
                }
                {alignment === '動画' &&
                <div>
                    <input
                        type='file'
                        id='mp4Input'
                        hidden='hidden'
                        accept="video/*"
                        onChange={handleVideoUpload}
                    />
                    <br/>
                    {videos && videos.length >= maxVideoUpload
                        ?
                            <IconButton onClick={handleEditVideo} disabled>
                                <LibraryAddIcon className='video' />
                            </IconButton>
                        :
                            <IconButton onClick={handleEditVideo}>
                                <LibraryAddIcon className='video' />
                            </IconButton>
                    }
                    {/* 動画をプレビュー */}
                    <Grid container>
                        {videos[videos.length-1] !== undefined && videos.map((video, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    display: 'flex'
                                }}
                            >
                                <Grid item 
                                    style={{
                                        margin:'auto'
                                    }}
                                > 
                                    <IconButton
                                        style={{
                                            top: 6,
                                            left: -10,
                                            color: "#aaa",
                                        }}
                                        onClick={() => handleOnRemoveMp4(i)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <CardMedia
                                        component="video"
                                        controls
                                        sx={{ Width: 151 }}
                                        image={URL.createObjectURL(video)}
                                        style={{
                                            width: "85%",
                                        }}
                                    />
                                </Grid>
                            </div>
                        ))}
                    </Grid>
                </div>
                }
                {title && journal
                    ?
                        <div className='submit-btn'>
                            <Button variant="contained" onClick={() => {newDiary(); deleteValue();}}>投稿</Button>
                        </div>
                    :
                        <div className='submit-btn'>
                            <Button disabled variant="contained">投稿</Button>
                        </div>
                }
            </Modal> 
        </>
    )
}

export default AddDiary