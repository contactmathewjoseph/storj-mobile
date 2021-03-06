import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyAccountNavComponent from '../../components/MyAccount/MyAccountNavComponent';
import moment from 'moment';
import { roundToGBAmount, formatAmount, getSum } from '../../utils/utils';
import { resetPassword } from '../../reducers/authentification/authActions';
import PropTypes from 'prop-types';

class MyAccountContainer extends Component {
    constructor(props) {
        super(props);

        this.balance = this.balance.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.activeScreen === "MyAccountScreen";
    }

    convertedCredits() {
        return this.props.credits
            .filter((c) => !c.promo_amount)
            .map((credit) => {
                const transaction = {...credit};
                transaction.amount = formatAmount(-credit.paid_amount);
                transaction.type = `${credit.type} payment`;
                transaction.description = `- Thank you!`;
                transaction.timestamp = moment.utc(credit.created).valueOf();
                return transaction;
            });
    }

    convertedDebits() {
        return this.props.debits.map((debit) => {
            const transaction = {...debit};
            let amountUsed;
            
            switch(debit.type) {
                case 'storage':
                    amountUsed = `: ${roundToGBAmount(debit.storage)} GBh`;
                    break;
                case 'bandwidth':
                    amountUsed = `: ${roundToGBAmount(debit.bandwidth, 'bytes')} GB`;
                    break;                
            }
            
            transaction.amount = formatAmount(debit.amount);
            transaction.type = debit.type;

            transaction.description = debit.type === 'adjustment'
                ? `: ${formatAmount(debit.amount)}`
                : amountUsed;

            transaction.timestamp = Date.parse(debit.created);
            return transaction;
        });
    }

    convertedPromoCredits() {
        return this.props.credits
            .filter((c) => c.promo_amount) .map((credit) => {
                const transaction = {...credit};
                
                transaction.amount = formatAmount(-credit.promo_amount);        
                transaction.description = '';
                transaction.timestamp = moment.utc(credit.created).valueOf();
        
                return transaction;
            });
    }

    calculateTransactions() {
        const convertedCredits = this.convertedCredits();
        const convertedDebits = this.convertedDebits();
        const convertedPromoCredits = this.convertedPromoCredits();

        let temp = [
            ...convertedCredits,
            ...convertedDebits,
            ...convertedPromoCredits
        ];

        return temp.sort((t1, t2) => (t2.timestamp - t1.timestamp));
    }

    balance() {
        const debitSum = getSum(this.props.debits, 'amount');
        const promoCreditSum = getSum(this.props.credits, 'promo_amount');
        const paidCreditSum = getSum(this.props.credits, 'paid_amount');
        const creditSum = paidCreditSum + promoCreditSum;
        const freeCredit = 167;
        const balance = -creditSum + debitSum - Math.min(debitSum, freeCredit);
        return formatAmount(balance);
      }

    render() {       
        return(
            <MyAccountNavComponent 
                redirectToInitializationScreen = { this.props.screenProps.redirectToInitializationScreen }
                showSyncWindow = { this.props.screenProps.showSyncWindow }
                showQR = { this.props.screenProps.showQR }
                showStorageInfo = { this.props.screenProps.showStorageInfo }
                showCredits = { this.props.screenProps.showCredits } 
                storageAmount = { this.props.storage }
                bandwidthAmount = { this.props.bandwidth }                
                getBalance = { this.balance }
                transactionList = { this.calculateTransactions() }
                resetPassword = { this.props.resetPassword } /> 
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;

    return {
        storage: state.billingReducer.storage,
        bandwidth: state.billingReducer.bandwidth,
        debits: state.billingReducer.debits,
        credits: state.billingReducer.credits,
        activeScreen: currentScreenName
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            resetPassword 
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);

MyAccountContainer.propTypes = {
    bandwidth: PropTypes.string,
    credits: PropTypes.array,
    debits: PropTypes.array,
    navigation: PropTypes.object,
    resetPassword: PropTypes.func,
    screenProps: PropTypes.object,
    storage: PropTypes.string
};