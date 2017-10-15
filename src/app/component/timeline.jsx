import Timeline from 'react-calendar-timeline/lib'
import moment from 'moment'

import React, {Component} from 'react';
import PropTypes from 'prop-types';


class TimeTable extends Component {
    constructor(props){
        super(props);

    }



    render() {

        return (
            <div>
                <Timeline groups={this.props.groups}
                          items={this.props.items}
                          defaultTimeStart={moment().startOf('day').add(-10,'day').toDate()}
                          defaultTimeEnd={moment().startOf('day').add(15, 'day').toDate()}
                          // timeSteps={{day: 1}}
                          minZoom={60 * 60 * 1000 * 24}
                          traditionalZoom={true}
                          stackItems={true}
                          lineHeight={45}
                          itemHeightRatio={0.75}
                          canMove={false}
                          canResize={false}
                          // clickTolerance={100}
                          // itemTouchSendsClick={true}
                          onItemDoubleClick={this.props.onItemClick}
                />
            </div>
        );
    }

    handleItemDoubleClick  = (itemId,e) => {
        console.log("click id " + itemId);
    }
}

TimeTable.propTypes = {};
TimeTable.defaultProps = {};

export default TimeTable;
