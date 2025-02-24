import './Search.scss' 
import React, {useEffect, useState} from "react";
// import axios from "../../http/http";
import style from "../SearchPage/SearchPage.module.scss";
import SearchItem from "./components/SearchItem";
import HotList from "./components/HotList";
import {
    Input, Radio, Select, AutoComplete, Button,
} from 'antd';

import {GetHotList, GetSearchRes, GetSearchWord} from "../../api/searchApi";
const { Option } = Select;
const sortOptions = [
    { label: '智能排序', value: 'score' },
    { label: '时间排序', value: 'time' },

];
const contentOptions = [
    { label: '标题或正文', value: 'all' },
    { label: '标题', value: 'title' },
    { label: '正文', value: 'content' },

];
const timeOptions = [
    { label: '全部时间', value: 'all' },
    { label: '一天以内', value: 'day' },
    { label: '一周以内', value: 'week' },
    { label: '一月以内', value: 'month' },
    { label: '一年以内', value: 'year' },
];


const washSearchData=(dataList)=>{
    dataList.map((item)=>{
        // item.title=item.title.substr(0,item.title.length-5)
        let materialTxt=''
        item.material.map((text)=>{materialTxt+=text})
        item.material=materialTxt
    })
    return dataList
}

export default function SearchPage() {
    const [sortValue, setSortValue] = useState('score')
    const [contentValue, setContentValue] = useState('all')
    const [timeValue, setTimeValue] = useState('all')

    const [searchList,setSearchList]=useState([
        {
            title:'工伤职工劳动功能障碍程度等级鉴定',
            link:'https://baidu.com',
            material:"1.劳动能力鉴定（确认）申请表收取原件（正本）1份1、A4规格；2.申请人签名或单位盖章……"
        },
        {
            title:'工伤职工劳动功能障碍程度等级鉴定',
            link:'https://baidu.com',
            material:"1.劳动能力鉴定（确认）申请表收取原件（正本）1份1、A4规格；2.申请人签名或单位盖章……"
        }
    ])
    const [hotList,setHotList]=useState([
        {
            word:'基层就业补贴',
        },
        {
            word:'生育津贴',
        }
    ])
    const [inputValue,setInputValue]=useState('')
    const [keywordList,setKeywordList]=useState([])
    const sortOnChange= e => {
        console.log('sortValue checked', e.target.value);
        setSortValue(e.target.value)
    };
    const timeOnChange= e => {
        console.log('timeValue checked', e.target.value);
        setTimeValue(e.target.value)
    };
    const contentOnChange= e => {
        console.log('contentValue checked', e.target.value);
        setContentValue(e.target.value)
    };

    const inputOnChange=e=>{
        setInputValue(e);
        getKeywordList(e)
    }
    const getKeywordList=(content)=>{  //获取搜索推荐词
        let data={
            keyword:content,

        }
        GetSearchWord(data).then(res=>{
            let keywordRes=res.data.data
            let final=[]
            if(keywordRes != null) {
                keywordRes.map(item=>{final.push({value:item})})
                console.log(final)
                setKeywordList(final)
            }
        })



    }
    const handleSearch=(value)=>{
        let data={
            keyword:value,

            contentMode:contentValue,
            searchMode:sortValue,
            timeFilter:timeValue
        }

        GetSearchRes(data).then((res)=>{
            let searchRes=res.data.data

            searchRes=washSearchData(searchRes)
            console.log(searchRes)
            setSearchList(searchRes)
        })

    }

    const handleHotList=(keyword)=>{
        setInputValue(keyword)
        handleSearch(keyword)
    }
    useEffect(()=>{
        GetHotList().then(res=>{
            console.log(res)
            let final=[]
            res.data.data.map(item=>{
                final.push({word:item[0],freq:item[1]})
            })
            console.log(final)
            setHotList(final)
        })
    },[])
    return (

        <div className={style.SearchPageContainer}>

            <Input.Group compact className='inputGroup'>

                <span className='inputTitle'>全站搜索:</span>
                <AutoComplete
                    className='autoComplete'
                    placeholder="Email"
                    options={keywordList}
                    size="large"
                    onChange={inputOnChange}
                    value={inputValue}/>
                <Button className='inputButton' size="large" type="primary" onClick={e=>{handleSearch(inputValue)}}>搜索</Button>

            </Input.Group>
            <div className='searchOptionContainer'>
                <div className='subContainer'><Radio.Group options={sortOptions} onChange={sortOnChange} value={sortValue} optionType="button"
                             buttonStyle="solid" className='searchOption'/></div>
                <div className='subContainer'><Radio.Group options={contentOptions} onChange={contentOnChange} value={contentValue} optionType="button"
                             buttonStyle="solid" className='searchOption'/></div>
                <div className='subContainer'><Radio.Group options={timeOptions} onChange={timeOnChange} value={timeValue} optionType="button"
                             buttonStyle="solid" className='searchOption'/></div>
            </div>
            <div className={style.mainContainer}>
                <div className={style.searchListContainer}>
                    {searchList.map((item)=>{
                        return(
                            <SearchItem content={item.material} link={item.link} title={item.title}></SearchItem>
                        )
                    })}
                </div>
                <div className={style.hotListContainer}>
                    <HotList wordList={hotList} handler={handleHotList}></HotList>
                </div>
            </div>
        </div>
    )
}
