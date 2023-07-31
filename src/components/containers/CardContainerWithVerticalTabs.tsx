import { clsx } from "clsx";

import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
      display: 'flex',
      height: 224,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      width: 200,
      
      padding: 20,
      position: 'fixed',
      
    },
  }));

  const VerticalTabs = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event : any, newValue : any) => {
      setValue(newValue);
    };
  
    return (
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          <Tab label="Txbit" />
          <Tab label="SWFT" />
          {/* 你可以根据需要添加更多Tab */}
        </Tabs>
        {/* 这里可以添加你的其他组件或者内容 */}
      </div>
    );
  }

const CardContainerWithVerticalTabs = ({ className, ...props }: any) => {
  return (
    <div style={{ position: 'relative', paddingLeft: '100px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100px' }}>
            <VerticalTabs />
        </div>

        <div className={clsx("card glass card-compact lg:card-normal", className)}>
            <div className="card-body text-neutral" {...props} />
        </div>
    </div>
  );
};

export default CardContainerWithVerticalTabs;
