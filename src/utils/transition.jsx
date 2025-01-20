import React, { useRef, useEffect, useContext, ReactNode } from 'react';
import { CSSTransition as ReactCSSTransition } from 'react-transition-group';

const TransitionContext = React.createContext({
    parent: {},
});

function useIsInitialRender() {
    const isInitialRender = useRef(true);
    useEffect(() => {
        isInitialRender.current = false;
    }, []);
    return isInitialRender.current;
}

function CSSTransition({
    show,
    enter = '',
    enterStart = '',
    enterEnd = '',
    leave = '',
    leaveStart = '',
    leaveEnd = '',
    appear,
    unmountOnExit,
    tag = 'div',
    children,
    ...rest
}) {
    const enterClasses = enter.split(' ').filter((s) => s.length);
    const enterStartClasses = enterStart.split(' ').filter((s) => s.length);
    const enterEndClasses = enterEnd.split(' ').filter((s) => s.length);
    const leaveClasses = leave.split(' ').filter((s) => s.length);
    const leaveStartClasses = leaveStart.split(' ').filter((s) => s.length);
    const leaveEndClasses = leaveEnd.split(' ').filter((s) => s.length);
    const removeFromDom = unmountOnExit;

    const addClasses = (node, classes) => {
        if (classes.length) node.classList.add(...classes);
    };

    const removeClasses = (node, classes) => {
        if (classes.length) node.classList.remove(...classes);
    };

    const nodeRef = useRef(null);
    const Component = tag;

    return (
        <ReactCSSTransition
            appear={appear}
            nodeRef={nodeRef}
            unmountOnExit={removeFromDom}
            in={show}
            addEndListener={(done) => {
                nodeRef.current?.addEventListener('transitionend', done, false);
            }}
            onEnter={() => {
                if (!removeFromDom && nodeRef.current) {
                    nodeRef.current.style.display = '';
                    addClasses(nodeRef.current, [...enterClasses, ...enterStartClasses]);
                }
            }}
            onEntering={() => {
                if (nodeRef.current) {
                    removeClasses(nodeRef.current, enterStartClasses);
                    addClasses(nodeRef.current, enterEndClasses);
                }
            }}
            onEntered={() => {
                if (nodeRef.current) {
                    removeClasses(nodeRef.current, [...enterEndClasses, ...enterClasses]);
                }
            }}
            onExit={() => {
                if (nodeRef.current) {
                    addClasses(nodeRef.current, [...leaveClasses, ...leaveStartClasses]);
                }
            }}
            onExiting={() => {
                if (nodeRef.current) {
                    removeClasses(nodeRef.current, leaveStartClasses);
                    addClasses(nodeRef.current, leaveEndClasses);
                }
            }}
            onExited={() => {
                if (nodeRef.current) {
                    removeClasses(nodeRef.current, [...leaveEndClasses, ...leaveClasses]);
                    if (!removeFromDom) nodeRef.current.style.display = 'none';
                }
            }}
        >
            <Component ref={nodeRef} {...rest} style={{ display: !removeFromDom ? 'none' : null }}>
                {children}
            </Component>
        </ReactCSSTransition>
    );
}

function Transition({ show, appear, ...rest }) {
    const { parent } = useContext(TransitionContext);
    const isInitialRender = useIsInitialRender();
    const isChild = show === undefined;

    if (isChild) {
        return (
            <CSSTransition
                appear={parent.appear ?? !parent.isInitialRender}
                show={parent.show}
                {...rest}
            />
        );
    }

    return (
        <TransitionContext.Provider
            value={{
                parent: {
                    show,
                    isInitialRender,
                    appear,
                },
            }}
        >
            <CSSTransition appear={appear} show={show} {...rest} />
        </TransitionContext.Provider>
    );
}

export default Transition;
