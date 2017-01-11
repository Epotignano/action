import React, {PropTypes} from 'react';
import InputField from 'universal/components/InputField/InputField';
import {Field, reduxForm} from 'redux-form';
import Type from 'universal/components/Type/Type';
import WelcomeHeading from '../WelcomeHeading/WelcomeHeading';
import {nextPage, updateCompleted, setWelcomeTeam} from 'universal/modules/welcome/ducks/welcomeDuck';
import shortid from 'shortid';
import {cashay} from 'cashay';
import {setAuthToken} from 'universal/redux/authDuck';
import {segmentEventTrack} from 'universal/redux/segmentActions';
import makeStep2Schema from 'universal/validation/makeStep2Schema';
import {randomPlaceholderTheme} from 'universal/utils/makeRandomPlaceholder';

const validate = (values) => {
  const welcomeSchema = makeStep2Schema('teamName');
  return welcomeSchema(values).errors;
};

const Step2TeamName = (props) => {
  const {dispatch, handleSubmit, preferredName, teamName} = props;
  const onTeamNameSubmit = (data) => {
    const teamId = shortid.generate();
    const teamMemberId = shortid.generate();
    dispatch(setWelcomeTeam({teamId, teamMemberId}));
    const createTeamOptions = {
      variables: {
        newTeam: {
          id: teamId,
          name: data.teamName.trim()
        }
      }
    };
    // createTeam returns a new JWT with a new tms field
    cashay.mutate('createTeam', createTeamOptions).then((res) => {
      dispatch(setAuthToken(res.data.createTeam));
      dispatch(segmentEventTrack('Welcome Step2 Completed'));
      dispatch(updateCompleted(2));
      dispatch(nextPage());
    });
  };
  return (
    <div>{/* Div for that flexy flex */}
      <Type align="center" italic scale="s6">
        Nice to meet you, {preferredName}!
      </Type>
      <WelcomeHeading copy={<span>Please type in your team name:</span>}/>
      <form onSubmit={handleSubmit(onTeamNameSubmit)}>
        <Field
          autoFocus
          buttonDisabled={!teamName}
          buttonIcon="check-circle"
          component={InputField}
          hasButton
          isLarger
          name="teamName"
          placeholder={randomPlaceholderTheme.teamName}
          shortcutHint="Press enter"
          type="text"
        />
      </form>
    </div>
  );
};

Step2TeamName.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  preferredName: PropTypes.string.isRequired,
  teamName: PropTypes.string,
  user: PropTypes.object,
  completed: PropTypes.number
};

export default reduxForm({
  form: 'welcomeWizard',
  destroyOnUnmount: false,
  validate
})(Step2TeamName);
