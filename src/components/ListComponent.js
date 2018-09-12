import React from 'react';
import {
    View,
    StyleSheet,
    RefreshControl,
    Text,
    Animated
} from 'react-native';
import ListItemComponent from "../components/ListItemComponent";
import GridItemComponent from '../components/GridItemComponent';
import ExpanderComponent from '../components/ExpanderComponent';
import PropTypes from 'prop-types';
import { getWidth, getHeight, getDeviceWidth } from '../utils/adaptive';
import SORTING from '../utils/constants/sortingConstants';
import { getFileNameWithFixedSize } from "../utils/fileUtils";

/**
* Custom List component
*/
export default ListComponent = (props) => {

    sortByDate = (items, sortingObject) => {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        items.forEach((item) => {
            var date = new Date(item.getDate());
            
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            var prop = day + ' ' + monthNames[monthIndex] + ' ' + year;            
            
            if(!sortingObject[prop]) {
                sortingObject[prop] = [];
            }

            sortingObject[prop].push(item);
        });
    }

    sortByName = (items, sortingObject) => {         
        items.forEach((item) => {
            var prop = item.getName().charAt(0).toUpperCase();            
            
            if(!sortingObject[prop]) {
                sortingObject[prop] = [];
            }

            sortingObject[prop].push(item);
        });
    }
   
    searchFilter = (data) => {
        if(!props.searchSubSequence) return data;

        return data.filter(item => 
            item.getName()
                .toLowerCase()
                .includes(props.searchSubSequence.toLowerCase()));

    }

    sort = (items) => {
        let data = searchFilter(items);
        
        let sortingObject = {};
        let sortingCallback;

        switch(props.sortingMode) {
            case SORTING.BY_DATE: sortingCallback = sortByDate;
                break;
            case SORTING.BY_NAME: sortingCallback = sortByName;
                break;
            default: sortingCallback = sortByDate;
        }
        
        sortingCallback(data, sortingObject);
        
        return sortingObject;
    }

    isItemActionsSelected = (item) => item.getId() === props.selectedItemId;

    getGridItemsList = () => {
        let sorting = sort(props.data);

        return Object.getOwnPropertyNames(sorting).reverse().map((propName) => {
            return (
                <View key = { propName }>
                    {
                        (() => {
                            let prop = sorting[propName];
                            let rowNumber = 1;

                            if(Array.isArray(prop) && prop.length) {

                                if(prop.length > 3) {
                                    rowNumber = Math.floor(prop.length / 3);

                                    if(prop.length % 3 != 0) {
                                        rowNumber += 1
                                    }
                                }

                                let data = [];

                                for(let i = 0; i < rowNumber; i++) {
                                    data.push(prop.splice(0,3));
                                }

                                let listItems = data.map((element, listIndex) => {
                                    return(
                                        <View key = { listIndex } style = { styles.unitContainer }>
                                            {
                                                element.map((item) => {
                                                    return(
                                                        <View style = { styles.itemContainer } key = { item.getId() }>
                                                            { getItem(item, GridItemComponent) }
                                                        </View>
                                                    );
                                                })
                                            }
                                        </View>
                                    );
                                })
                                return(
                                    <ExpanderComponent
                                        isListActionsDisabled = { props.isListActionsDisabled }
                                        propName = { propName } 
                                        listItems = { listItems } />
                                );
                            }
                        })()
                    }
                    <View style = { styles.underLine }/>
                </View>
            );
        });
    }

    renderItems = (sorting, propName) => {
        let prop = sorting[propName];
        if(Array.isArray(prop) && prop.length) {
            let listItems = prop.map((item) => { 
                return getItem(item, ListItemComponent);
            });

            return(
                <ExpanderComponent
                    isListActionsDisabled = { props.isListActionsDisabled }
                    propName = { propName } 
                    listItems = { listItems } />
            );
        }
    }

    getListItemsList = () => {
        let sorting = sort(props.data);

        return Object.getOwnPropertyNames(sorting).reverse().map((propName, index) => {
            return (
                <View key = { propName }>
                    {
                        renderItems(sorting, propName)
                    }
                    <View style = { styles.underLine }/>   
                </View>
            );
        });
    }

    getItemsWithoutExpander = () => {
        return props.data.map((item) => {
            return getItem(item, ListItemComponent);
        })
    }

    getItem = (item, ItemType) => {
        const TextComp = props.textComp;
        const isSingleItemSelected = isItemActionsSelected(item);
        const size = item.entity.size ? props.getItemSize(item.entity.size) : null;
        const listItemIconSource = item.entity.thumbnail ? 
                                    { uri: 'data:image/png;base64,' + item.entity.thumbnail } 
                                    : item.entity.isDownloaded ? props.listItemIcon : props.cloudListItemIcon;
        const starredIcon = item.getStarred() ? '★' : null;
        let fullItemName = getFileNameWithFixedSize(item.getName(), 20)

        return(
            <ItemType
                isExpanderDisabled = { props.isExpanderDisabled }
                key = { item.getId() }
                listItemIconSource = { listItemIconSource }
                onPress = { () => props.onPress(item) }
                onLongPress = { () => props.onLongPress(item) }
                onDotsPress = { () => props.onDotsPress(item) }
                onCancelPress = { () => props.onCancelPress(item) }
                isSelectionMode = { props.isSelectionMode }
                isSingleItemSelected = { isSingleItemSelected }
                isSelected = { item.isSelected }
                isLoading = { item.isLoading }
                progress = { item.progress } 
                size = { size }
                isListActionsDisabled = { props.isListActionsDisabled } >

                <TextComp style = { props.isExpanderDisabled ? [styles.mainTitleText, styles.textMargin] : styles.mainTitleText }>
                    <Text style = { styles.blueStar }>
                        { starredIcon }
                    </Text>
                    { fullItemName.name }
                    <Text style = { styles.extentionText } >{ fullItemName.extention }</Text>
                    </TextComp>
            </ItemType>
        );
    }

    getItemsList = () => {
        if(props.isExpanderDisabled) 
            return getItemsWithoutExpander();
    
        return props.isGridViewShown 
                    ? getGridItemsList()
                    : getListItemsList();
    }
                    
    return (
        <Animated.ScrollView style = { styles.listContainer }
            decelerationRate = { 'normal' }
            scrollEventThrottle = { 16 }
            onScroll = {
                Animated.event([{
                    nativeEvent: { 
                            contentOffset: { 
                                y: props.animatedScrollValue 
                            } 
                        }
                    }
                ], { useNativeDriver: true }) }
            refreshControl = {
                <RefreshControl
                    enabled = { !props.isSelectionMode }
                    refreshing = { props.isRefreshing }
                    onRefresh = { props.onRefresh } /> }>
                    <View style = { props.contentWrapperStyle ? props.contentWrapperStyle : null }>
                        {
                            getItemsList()
                        }
                    </View>
        </Animated.ScrollView>       
    );
}

ListComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    cloudListItemIcon: PropTypes.number,
    contentWrapperStyle: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object
    ]),
    data: PropTypes.array,
    getItemSize: PropTypes.func,
    isExpanderDisabled: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    isListActionsDisabled: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    listItemIcon: PropTypes.number,
    onCancelPress: PropTypes.func,
    onDotsPress: PropTypes.func,
    onRefresh: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    selectedItemId: PropTypes.string,
    sortingMode: PropTypes.string,
    textComp: PropTypes.func
}; 

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: 'white'
    },
    unitContainer: { 
        flexDirection: 'row',
        width: getWidth(333),  
        height: getHeight(130)
    },
    itemContainer: {
        alignSelf: 'flex-start'
    },
    mainTitleText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    blueStar: {
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    underLine: { 
        height: 0.5, 
        width: getDeviceWidth(), 
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    textMargin: {
        marginLeft: getWidth(10)
    },
    extentionText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: 'rgba(56, 75, 101, 0.4)'
    }
});
