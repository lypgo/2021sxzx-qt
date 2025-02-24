import React, {useEffect, useState} from 'react'
import style from './Maincontent.module.scss'
import IntIcon from '../../../../assets/icon_gerenyewu.png'
import EnvIcon from '../../../../assets/icon_qiyeyewu.png'
import shbx from '../../../../assets/icon_shehuibaoxian.png'
import rcrs from '../../../../assets/icon_rencairenshi.png'
import jycy from '../../../../assets/icon_jiuyechuangye.png'
import ldbz from '../../../../assets/icon_laodongbaozhang.png'
import { Link, useHistory } from 'react-router-dom'
import axios from '../../../../api/http'
// parent -> classify
// child -> specific

export default function Maincontent() {
    const history = useHistory();
    const [parentRuleIdIndex, setParentRuleIdIndex] = useState(0);
    const [parentRuleList, setParentRuleList] = useState([]);
    const [childRuleList, setChildRuleList] = useState([[]]);

    var tmpList = [];
    var picSrc = '';

    useEffect(() => {
        let data;
        axios.post('/v1/getRules', {
            parentId: '0'
        }).then(res => {
            data = res.data.data;
            setParentRuleList(data);  
            data.map(item => {
                axios.post('/v1/getRules', {
                    parentId: item.rule_id
                }).then(res => {
                    tmpList.push(res.data.data);
                    setChildRuleList(tmpList);
                }).catch(res => {
                    console.log(res);
                })
            })
        }).catch(res => {
            console.log(res);
        })
    }, [])
    
    const handleParentClick = (index) => {
        setParentRuleIdIndex(index);
    }

    const handleChildClick = (item) => {
        var ruleSelected = [];
        ruleSelected.push(parentRuleList[parentRuleIdIndex], item);
        history.push({
            pathname: '/navigation',
            state: { homeRuleSelected: ruleSelected, secondRuleId: item.rule_id }
        })
    }

    return (
        <div className={style.container}>
            <div className={style.banner_show}>
                <div className={style.slogan1}>广州人设 为您解决事项咨询最后一公里问题</div>
                <div className={style.slogan2}>广州人设为您提供866个事项咨询，打造一站式事项咨询平台</div>
                <div className={style.ind_or_ent}>
                    <Link to='#'>
                        <div className={style.individual}>
                            <img src={IntIcon}></img>
                            个人业务
                        </div>
                    </Link>
                    <Link to='#'>
                        <div className={style.enterprise}>
                            <img src={EnvIcon}></img>
                            法人业务
                        </div>
                    </Link>
                </div>
            </div>
            <div className={style.business_show}>
                <div className={style.classify}>
                    {
                        parentRuleList.map((item, index) => {
                            return(
                                <div className={parentRuleIdIndex == index ? style.active : null}
                                    onClick={handleParentClick.bind(this, index)}>
                                    { item.rule_name }
                                </div>
                            )
                        })
                    }
                </div>
                <div className={style.specific}>
                    { console.log('childRuleList: ', childRuleList) }
                    {
                        childRuleList[parentRuleIdIndex]&&childRuleList[parentRuleIdIndex].map((item, index) => {
                            console.log('child: ', item);
                            switch (item.rule_name) {
                                case '劳动保障':
                                    picSrc = ldbz; break;
                                case '人事人才':
                                    picSrc = rcrs; break;
                                case '社会保险':
                                    picSrc = shbx; break;
                                case '就业创业':
                                    picSrc = jycy; break;
                            }   
                            return (
                                <div onClick={handleChildClick.bind(this, item)}>
                                    <div className={style.outborder}>
                                        <div>
                                            <img src={picSrc}></img>
                                        </div>
                                    </div>
                                    <p>{ item.rule_name }</p>
                                </div>
                            )
                            
                        })

                    }
                </div>
            </div>
        </div>
     )}