/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  markdown: {
    padding: theme.spacing(2),
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& p': {
      marginBottom: theme.spacing(1),
    },
    '& code': {
      backgroundColor: theme.palette.type === 'dark' ? '#2d2d2d' : '#f5f5f5',
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius,
      fontFamily: 'monospace',
    },
    '& pre': {
      backgroundColor: theme.palette.type === 'dark' ? '#2d2d2d' : '#f5f5f5',
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
    },
    '& pre code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
    '& ul, & ol': {
      marginBottom: theme.spacing(1),
    },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(2),
      marginLeft: 0,
      fontStyle: 'italic',
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    '& th, & td': {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: theme.palette.type === 'dark' ? '#2d2d2d' : '#f5f5f5',
      fontWeight: 'bold',
    },
  },
}));

/** @public */
export type MarkdownDefinitionWidgetProps = {
  definition: string;
};

/** @public */
export const MarkdownDefinitionWidget = (
  props: MarkdownDefinitionWidgetProps,
) => {
  const classes = useStyles();

  return (
    <div className={classes.markdown}>
      <ReactMarkdown>{props.definition}</ReactMarkdown>
    </div>
  );
};
